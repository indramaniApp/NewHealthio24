import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Animated,
  StatusBar,
  DeviceEventEmitter,
  NativeModules,
  AppState,
  Alert,
} from "react-native";

import RNCallKeep from "react-native-callkeep";

import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  VideoSourceType,
  ConnectionStateType,
} from "react-native-agora";

// Ringtone relies on custom Java Module to play system ringtone directly
// import Sound from "react-native-sound"; 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ApiService from "../../api/ApiService";
import { ENDPOINTS } from "../../constants/Endpoints";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/slices/loaderSlice";

// ─────────────────────────────────────────────────────────────
// RINGTONE SETUP
//
// We now rely purely on the Android Native RingtoneModule to play system ringtone!
// ─────────────────────────────────────────────────────────────

const { CallForegroundServiceModule } = NativeModules;
const APP_ID = "950b8b4267344a96a51051dd8bd6924a";

// ─────────────────────────────────────────────────────────────
// Ringtone helpers (using NativeModule)
// ─────────────────────────────────────────────────────────────

const startRingtone = () => {
  try {
    if (NativeModules.RingtoneModule) {
      NativeModules.RingtoneModule.playRingtone();
      console.log("🔔 Native System Ringtone started");
    }
  } catch (err) {
    console.warn("⚠️ Native Ringtone start fail:", err);
  }
};

const stopRingtone = () => {
  try {
    if (NativeModules.RingtoneModule) {
      NativeModules.RingtoneModule.stopRingtone();
      console.log("🔕 Native System Ringtone stopped");
    }
  } catch (err) {
    console.warn("⚠️ Native Ringtone stop fail:", err);
  }
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
const PatientVideoCallScreen = ({ route, navigation }) => {
  const { appointmentId, fcmAppointmentId, doctorName, callAcceptedViaCallKeep } = route.params;
  const dispatch = useDispatch();

  // Refs
  const agoraEngineRef = useRef(null);
  const timerRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isCallEndedRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  // State
  const [remoteUid, setRemoteUid] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [isLocalFull, setIsLocalFull] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [networkQuality, setNetworkQuality] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const displayDoctorName =
    doctorName && doctorName !== "Doctor" ? doctorName : "Specialist Doctor";

  // ─── Pulse animation for incoming screen ──────────────────
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  // ─── Start ringtone on mount (incoming call screen) ───────
  useEffect(() => {
    // If we're coming from CallKeep Accept, jump straight to the call
    if (callAcceptedViaCallKeep) {
      setCallAccepted(true);
      setupAgora();
    } else {
      startRingtone();
      stopNativeService();
    }

    return () => {
      // Safety: always stop ring and clean up when screen unmounts
      stopRingtone();
      stopNativeService();
      destroyAgora();
      RNCallKeep.endAllCalls();
    };
  }, []);

  // ─── Stop ringtone if app goes background mid-call ────────
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current.match(/active/) &&
        nextState === "background" &&
        !callAccepted
      ) {
        // Screen went background before accepting — keep native ring but stop JS ring
        stopRingtone();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [callAccepted]);

  // ─── Native foreground service helper ─────────────────────
  const stopNativeService = () => {
    try {
      if (CallForegroundServiceModule?.stopService) {
        CallForegroundServiceModule.stopService();
        console.log("🛑 Native foreground service stopped");
      }
    } catch (e) {
      console.warn("⚠️ stopNativeService error:", e.message);
    }
  };

  // ─── Permissions ──────────────────────────────────────────
  const requestPermissions = async () => {
    if (Platform.OS !== "android") return true;
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    return (
      granted["android.permission.CAMERA"] === "granted" &&
      granted["android.permission.RECORD_AUDIO"] === "granted"
    );
  };

  // ─── Call complete API ────────────────────────────────────
  const callCompleteApi = async () => {
    try {
      dispatch(showLoader());
      const res = await ApiService.post(
        `${ENDPOINTS.patient_complete_video_calling}/${fcmAppointmentId}`,
        {},
        false,
        true
      );
      console.log("✅ Complete API:", res);
    } catch (error) {
      console.warn("❌ Complete API error:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // ─── Agora Setup ──────────────────────────────────────────
  const setupAgora = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn("❌ Permissions denied");
      Alert.alert("Permission Error", "Camera/Mic permissions were denied or blocked by Android in the background.");
      return;
    }

    try {
      const response = await ApiService.post(
        `${ENDPOINTS.patient_join_video_calling}/${appointmentId}`,
        {},
        true,
        true
      );

      if (response?.status !== "success") {
        console.warn("❌ Join API failed", response);
        Alert.alert("API Error", "Join API failed. Server rejected the call session or token was missing. Wait for a moment if cold-starting.");
        leaveCall("error");
        return;
      }

      const callData = response.data;
      const channel = callData.channelName || callData.channel_name;
      const uid = Number(callData.uid) || 0;
      const token = callData.video_token || callData.token;

      setChannelName(channel);

      const engine = createAgoraRtcEngine();
      agoraEngineRef.current = engine;

      engine.initialize({ appId: APP_ID });
      engine.enableVideo();
      engine.enableAudio();
      engine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
      engine.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      engine.setDefaultAudioRouteToSpeakerphone(true); // default to speaker
      engine.startPreview();

      engine.registerEventHandler({
        onJoinChannelSuccess: (_connection, elapsed) => {
          console.log("✅ Joined channel, elapsed:", elapsed);
          startTimer();
        },
        onUserJoined: (_connection, rUid) => {
          console.log("✅ Doctor joined, uid:", rUid);
          // Stop any remaining ringtone the moment doctor's video connects
          stopRingtone();
          stopNativeService();
          DeviceEventEmitter.emit("STOP_RING_EVENT");
          setRemoteUid(rUid);
        },
        onUserOffline: (_connection, rUid, reason) => {
          console.log("❌ Doctor left, reason:", reason);
          setRemoteUid(null);
          leaveCall("remote_left");
        },
        onError: (errorCode, msg) => {
          console.warn("⚠️ Agora error:", errorCode, msg);
        },
        onTokenPrivilegeWillExpire: (_connection, token) => {
          // TODO: fetch a fresh token from your server and call engine.renewToken()
          console.warn("⚠️ Token expiring soon — implement token refresh");
        },
        onNetworkQuality: (_connection, remoteUid, txQuality, rxQuality) => {
          if (remoteUid === 0) {
            setNetworkQuality(Math.max(txQuality, rxQuality));
          }
        },
        onConnectionStateChanged: (state, reason) => {
          if (state === ConnectionStateType.ConnectionStateReconnecting) {
            setIsReconnecting(true);
          } else if (state === ConnectionStateType.ConnectionStateConnected) {
            setIsReconnecting(false);
          }
        },
      });

      engine.setupLocalVideo({
        canvas: { uid: 0 },
        sourceType: VideoSourceType.VideoSourceCamera,
      });

      engine.joinChannel(token, channel, uid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        publishMicrophoneTrack: true,
        publishCameraTrack: true,
        autoSubscribeAudio: true,
        autoSubscribeVideo: true,
      });
    } catch (err) {
      console.warn("❌ Agora setup error:", err);
      leaveCall("error");
    }
  };

  // ─── Timer ────────────────────────────────────────────────
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setSeconds((prev) => prev + 1),
      1000
    );
  };

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const rs = s % 60;
    if (h > 0) return `${h}:${m < 10 ? "0" : ""}${m}:${rs < 10 ? "0" : ""}${rs}`;
    return `${m}:${rs < 10 ? "0" : ""}${rs}`;
  };

  // ─── Destroy Agora ────────────────────────────────────────
  const destroyAgora = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (agoraEngineRef.current) {
      agoraEngineRef.current.stopPreview();
      agoraEngineRef.current.leaveChannel();
      agoraEngineRef.current.release();
      agoraEngineRef.current = null;
    }
  };

  // ─── Leave Call ───────────────────────────────────────────
  const leaveCall = useCallback(
    async (source = "unknown") => {
      if (isCallEndedRef.current) return;
      isCallEndedRef.current = true;

      // Always stop ringtone on leave — covers all exit paths
      stopRingtone();
      stopNativeService();
      DeviceEventEmitter.emit("STOP_RING_EVENT");

      if (source === "end_call") {
        await callCompleteApi();
      }

      destroyAgora();
      RNCallKeep.endAllCalls();
      navigation.goBack();
    },
    [navigation]
  );

  // ─── Accept incoming ──────────────────────────────────────
  const handleAccept = () => {
    // Stop ringtone immediately on accept tap — don't wait for remote user join
    stopRingtone();
    stopNativeService();
    DeviceEventEmitter.emit("STOP_RING_EVENT");
    setCallAccepted(true);
    setupAgora();
  };

  // ─── Decline incoming ─────────────────────────────────────
  const handleDecline = () => {
    stopRingtone();
    stopNativeService();
    DeviceEventEmitter.emit("STOP_RING_EVENT");
    destroyAgora();
    RNCallKeep.endAllCalls();
    navigation.goBack();
  };

  // ─── In-call controls ─────────────────────────────────────
  const toggleMute = () => {
    const next = !muted;
    agoraEngineRef.current?.muteLocalAudioStream(next);
    setMuted(next);
  };

  const toggleCamera = () => {
    const next = !cameraOff;
    agoraEngineRef.current?.enableLocalVideo(!next);
    setCameraOff(next);
  };

  const toggleSpeaker = () => {
    const next = !speakerOn;
    agoraEngineRef.current?.setEnableSpeakerphone(next);
    setSpeakerOn(next);
  };

  const handleSwitchCamera = () => {
    agoraEngineRef.current?.switchCamera();
  };

  // ─── Video rendering ──────────────────────────────────────
  const renderVideos = () => {
    if (!channelName) return null;

    const mainUid = isLocalFull ? 0 : remoteUid ?? 0;
    const pipUid = isLocalFull ? remoteUid : 0;

    return (
      <>
        {/* Full-screen main video */}
        <RtcSurfaceView
          style={styles.fullVideo}
          canvas={{ uid: mainUid }}
          connection={{ channelId: channelName }}
        />

        {/* PiP — only show when both sides are present */}
        {remoteUid !== null && (
          <TouchableOpacity
            style={styles.floatingVideo}
            onPress={() => setIsLocalFull((v) => !v)}
            activeOpacity={0.9}
          >
            <RtcSurfaceView
              style={styles.videoFill}
              canvas={{ uid: pipUid }}
              connection={{ channelId: channelName }}
              zOrderMediaOverlay={true}
            />
            <View style={styles.pipLabel}>
              <Text style={styles.pipLabelText}>
                {isLocalFull ? "Dr. " + displayDoctorName : "You"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {callAccepted ? (
        // ── In-Call UI ──────────────────────────────────────
        <>
          {renderVideos()}

          {/* Waiting for doctor overlay */}
          {!remoteUid && (
            <View style={styles.waiting}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <MaterialCommunityIcons
                  name="account-clock-outline"
                  size={70}
                  color="#fff"
                />
              </Animated.View>
              <Text style={styles.waitText}>
                Waiting for Dr. {displayDoctorName}…
              </Text>
              <Text style={styles.waitSubText}>Connecting your call</Text>
            </View>
          )}

          {/* Timer */}
          <View style={styles.timerBadge}>
            <View style={styles.liveIndicator} />
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          </View>

          {/* Network Quality & Reconnecting Badge */}
          {(networkQuality > 0 || isReconnecting) && (
            <View style={styles.qualityBadge}>
              <MaterialCommunityIcons
                name={isReconnecting ? "wifi-strength-alert-outline" : networkQuality < 3 ? "wifi" : networkQuality < 5 ? "wifi-strength-2" : "wifi-strength-1"}
                size={16}
                color={isReconnecting ? "#ef4444" : networkQuality < 3 ? "#22c55e" : networkQuality < 5 ? "#eab308" : "#ef4444"}
              />
              <Text style={styles.qualityText}>
                {isReconnecting ? "Reconnecting..." : networkQuality < 3 ? "Good" : networkQuality < 5 ? "Fair" : "Poor"}
              </Text>
            </View>
          )}

          {/* Doctor name banner */}
          {remoteUid && (
            <View style={styles.nameBanner}>
              <Text style={styles.nameBannerText}>
                Dr. {displayDoctorName}
              </Text>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controls}>
            {/* Mute */}
            <TouchableOpacity
              style={[styles.controlBtn, muted && styles.controlBtnActive]}
              onPress={toggleMute}
            >
              <MaterialCommunityIcons
                name={muted ? "microphone-off" : "microphone"}
                size={24}
                color="#fff"
              />
              <Text style={styles.controlLabel}>
                {muted ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>

            {/* Camera toggle */}
            <TouchableOpacity
              style={[styles.controlBtn, cameraOff && styles.controlBtnActive]}
              onPress={toggleCamera}
            >
              <MaterialCommunityIcons
                name={cameraOff ? "camera-off" : "camera"}
                size={24}
                color="#fff"
              />
              <Text style={styles.controlLabel}>
                {cameraOff ? "Cam Off" : "Camera"}
              </Text>
            </TouchableOpacity>

            {/* End Call */}
            <TouchableOpacity
              style={[styles.controlBtn, styles.endCallBtn]}
              onPress={() => leaveCall("end_call")}
            >
              <MaterialCommunityIcons
                name="phone-hangup"
                size={30}
                color="#fff"
              />
              <Text style={styles.controlLabel}>End</Text>
            </TouchableOpacity>

            {/* Speaker toggle */}
            <TouchableOpacity
              style={[styles.controlBtn, !speakerOn && styles.controlBtnActive]}
              onPress={toggleSpeaker}
            >
              <MaterialCommunityIcons
                name={speakerOn ? "volume-high" : "volume-off"}
                size={24}
                color="#fff"
              />
              <Text style={styles.controlLabel}>
                {speakerOn ? "Speaker" : "Earpiece"}
              </Text>
            </TouchableOpacity>

            {/* Flip camera */}
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleSwitchCamera}
            >
              <MaterialCommunityIcons
                name="camera-flip"
                size={24}
                color="#fff"
              />
              <Text style={styles.controlLabel}>Flip</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // ── Incoming Call UI ────────────────────────────────
        <View style={styles.incomingContainer}>
          {/* Top section: avatar + name */}
          <View style={styles.incomingTop}>
            <Text style={styles.incomingBadge}>📹 INCOMING VIDEO CALL</Text>

            <Animated.View
              style={[
                styles.avatarRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.avatarInner}>
                <MaterialCommunityIcons
                  name="doctor"
                  size={80}
                  color="#fff"
                />
              </View>
            </Animated.View>

            <Text style={styles.doctorName}>Dr. {displayDoctorName}</Text>
            <Text style={styles.doctorSubtitle}>Ringing…</Text>
          </View>

          {/* Bottom: decline + accept */}
          <View style={styles.incomingActions}>
            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[styles.actionCircle, styles.declineCircle]}
                onPress={handleDecline}
              >
                <MaterialCommunityIcons
                  name="phone-hangup"
                  size={36}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Decline</Text>
            </View>

            <View style={styles.actionCol}>
              <TouchableOpacity
                style={[styles.actionCircle, styles.acceptCircle]}
                onPress={handleAccept}
              >
                <MaterialCommunityIcons
                  name="video"
                  size={36}
                  color="#fff"
                />
              </TouchableOpacity>
              <Text style={styles.actionLabel}>Accept</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // ── Videos ─────────────────────────────────────────────────
  fullVideo: {
    flex: 1,
  },
  videoFill: {
    flex: 1,
  },
  floatingVideo: {
    position: "absolute",
    top: 56,
    right: 16,
    width: 110,
    height: 165,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  pipLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 3,
    alignItems: "center",
  },
  pipLabelText: {
    color: "#fff",
    fontSize: 10,
  },

  // ── Waiting overlay ────────────────────────────────────────
  waiting: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  waitText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  waitSubText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginTop: 6,
  },

  // ── Timer ──────────────────────────────────────────────────
  timerBadge: {
    position: "absolute",
    top: 52,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
  timerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 1,
  },
  qualityBadge: {
    position: "absolute",
    top: 90,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  qualityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  // ── Doctor name banner ─────────────────────────────────────
  nameBanner: {
    position: "absolute",
    bottom: 130,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  nameBannerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Control bar ────────────────────────────────────────────
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 8,
    paddingBottom: 36,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  controlBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    gap: 0,
  },
  controlBtnActive: {
    backgroundColor: "rgba(255,80,80,0.4)",
  },
  endCallBtn: {
    backgroundColor: "#ef4444",
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  controlLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    marginTop: 3,
  },

  // ── Incoming Call screen ───────────────────────────────────
  incomingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "space-between",
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: "center",
  },
  incomingTop: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  incomingBadge: {
    color: "#94a3b8",
    fontSize: 13,
    letterSpacing: 1.5,
    marginBottom: 32,
    textTransform: "uppercase",
  },
  avatarRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(34,197,94,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(34,197,94,0.4)",
  },
  avatarInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(34,197,94,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  doctorName: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 24,
    textAlign: "center",
  },
  doctorSubtitle: {
    color: "#64748b",
    fontSize: 16,
    marginTop: 8,
  },
  incomingActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
  },
  actionCol: {
    alignItems: "center",
    gap: 10,
  },
  actionCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptCircle: {
    backgroundColor: "#22c55e",
  },
  declineCircle: {
    backgroundColor: "#ef4444",
  },
  actionLabel: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
  },
});

export default PatientVideoCallScreen;

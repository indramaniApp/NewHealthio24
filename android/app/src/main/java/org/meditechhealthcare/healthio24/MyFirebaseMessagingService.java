package org.meditechhealthcare.healthio24;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.PowerManager;
import android.util.Log;
import android.app.ActivityManager;
import androidx.core.app.NotificationCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import java.util.List;
import java.util.Map;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "FCM_SERVICE";
    private static final String CHANNEL_ID = "call_channel";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        Log.d(TAG, "🔔 Notification Received in Java: " + data);

        // Use PARTIAL_WAKE_LOCK as FULL_WAKE_LOCK throws exceptions on Android 15
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        PowerManager.WakeLock wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK |
                PowerManager.ACQUIRE_CAUSES_WAKEUP |
                PowerManager.ON_AFTER_RELEASE, "Healthio24:WakeLock");
        wakeLock.acquire(30000);

        String type = data.get("type");

        if (type != null && type.equals("incoming_call")) {
            handleIncomingCall(data);
        } else if (type != null && type.equals("call_end")) {
            handleCallEnd(data);
        }

        if (wakeLock.isHeld()) wakeLock.release();
    }

    private void handleIncomingCall(Map<String, String> data) {
        // Handle both possible keys from backend
        String doctorName = data.get("doctorName");
        if (doctorName == null) doctorName = data.get("doctor_name");
        if (doctorName == null) doctorName = "Doctor";
        
        String appointmentId = data.get("appointmentId");
        int notificationId = (appointmentId != null) ? appointmentId.hashCode() : 12345;

        // 🚨 IF APP IS IN FOREGROUND, DO NOT SHOW NATIVE NOTIFICATION! 🚨
        // React Native (App.jsx) will catch the FCM and show PatientVideoCallScreen directly!
        if (isAppInForeground()) {
            Log.d(TAG, "🟢 App is in Foreground! Skipping native notification. React Native will handle it.");
            return;
        }

        // 1️⃣ START RINGTONE SERVICE (Which also builds the Notification)
        Intent serviceIntent = new Intent(this, CallForegroundService.class);
        serviceIntent.setAction("START_CALL_RINGTONE"); 
        serviceIntent.putExtra("doctorName", doctorName);
        serviceIntent.putExtra("appointmentId", appointmentId);
        serviceIntent.putExtra("fcmAppointmentId", data.get("fcmAppointmentId"));
        serviceIntent.putExtra("notificationId", notificationId);
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }
    }

    private boolean isAppInForeground() {
        ActivityManager activityManager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses == null) return false;
        final String packageName = getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    private void handleCallEnd(Map<String, String> data) {
        String appointmentId = data.get("appointmentId");
        int notificationId = (appointmentId != null) ? appointmentId.hashCode() : 12345;

        // Ringtone band karo
        Intent stopIntent = new Intent(this, CallForegroundService.class);
        stopService(stopIntent);

        // Specific Notification hatayein
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancel(notificationId);
    }
}
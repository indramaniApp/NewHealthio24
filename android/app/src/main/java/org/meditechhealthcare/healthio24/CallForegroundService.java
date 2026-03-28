package org.meditechhealthcare.healthio24;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.net.Uri;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.graphics.Color;

public class CallForegroundService extends Service {

    private MediaPlayer mediaPlayer;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent != null ? intent.getAction() : null;
        if ("STOP_CALL_RINGTONE".equals(action)) {
            Log.d("CALL_DEBUG", "Stopping call ringtone natively");
            stopForeground(true);
            stopSelf();
            return START_NOT_STICKY;
        }

        Log.d("CALL_DEBUG", "🔥 Service Started");

        // 🆔 dynamic data handle karna
        int notificationId = intent != null ? intent.getIntExtra("notificationId", 12345) : 12345;
        String doctorName = intent != null ? intent.getStringExtra("doctorName") : "Doctor";

        createNotificationChannel();

        Intent fullScreenIntent = new Intent(this, MainActivity.class);
        fullScreenIntent.setAction(Intent.ACTION_VIEW);
        fullScreenIntent.setData(Uri.parse("healthio24://call?action=view&appointmentId=" + intent.getStringExtra("appointmentId") + "&fcmAppointmentId=" + intent.getStringExtra("fcmAppointmentId") + "&doctorName=" + Uri.encode(doctorName)));
        fullScreenIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent fullScreenPendingIntent = PendingIntent.getActivity(
                this, 0, fullScreenIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // Action Accept
        Intent acceptIntent = new Intent(this, MainActivity.class);
        acceptIntent.setAction(Intent.ACTION_VIEW);
        acceptIntent.setData(Uri.parse("healthio24://call?action=accept&appointmentId=" + intent.getStringExtra("appointmentId") + "&fcmAppointmentId=" + intent.getStringExtra("fcmAppointmentId") + "&doctorName=" + Uri.encode(doctorName)));
        acceptIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent acceptPendingIntent = PendingIntent.getActivity(
                this, 1, acceptIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        // Action Decline
        Intent declineIntent = new Intent(this, CallForegroundService.class);
        declineIntent.setAction("STOP_CALL_RINGTONE");
        PendingIntent declinePendingIntent = PendingIntent.getService(
                this, 2, declineIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        Spannable declineText = new SpannableString("Decline");
        declineText.setSpan(new ForegroundColorSpan(Color.parseColor("#ff4444")), 0, declineText.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        Spannable acceptText = new SpannableString("Accept");
        acceptText.setSpan(new ForegroundColorSpan(Color.parseColor("#00C851")), 0, acceptText.length(), Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);

        Notification.Builder builder = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ? 
                new Notification.Builder(this, "call_channel") : new Notification.Builder(this);

        Notification notification = builder
                .setContentTitle("Incoming Video Call")
                .setContentText(doctorName + " is calling...")
                .setSmallIcon(R.mipmap.ic_launcher)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setCategory(Notification.CATEGORY_CALL)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setPriority(Notification.PRIORITY_MAX)
                .setOngoing(true)
                .addAction(new Notification.Action.Builder(null, declineText, declinePendingIntent).build())
                .addAction(new Notification.Action.Builder(null, acceptText, acceptPendingIntent).build())
                .build();

        // 🛡️ Start Foreground for Android 14+ support using SHORT_SERVICE
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(notificationId, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SHORT_SERVICE);
        } else {
            startForeground(notificationId, notification);
        }

        // 🔊 Ringtone play logic
        playRingtone();

        return START_STICKY;
    }

    private void playRingtone() {
        try {
            if (mediaPlayer != null) {
                mediaPlayer.stop();
                mediaPlayer.release();
                mediaPlayer = null;
            }

            Uri ringUri = Settings.System.DEFAULT_RINGTONE_URI;
            if (ringUri == null) ringUri = Settings.System.DEFAULT_NOTIFICATION_URI;

            mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(this, ringUri);
            mediaPlayer.setWakeMode(getApplicationContext(), PowerManager.PARTIAL_WAKE_LOCK);

            mediaPlayer.setAudioAttributes(
                    new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
            );

            mediaPlayer.setLooping(true);
            mediaPlayer.setOnPreparedListener(mp -> {
                Log.d("CALL_DEBUG", "🔊 Ringtone Playing Started!");
                mp.start();
            });

            mediaPlayer.prepareAsync(); 

        } catch (Exception e) {
            Log.e("CALL_DEBUG", "❌ MediaPlayer Error: " + e.getMessage());
        }
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    "call_channel", "Calls", NotificationManager.IMPORTANCE_HIGH
            );
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            channel.setSound(null, null); // Sound MediaPlayer handle kar raha hai
            
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    @Override
    public void onDestroy() {
        Log.d("CALL_DEBUG", "🛑 Service Destroyed");
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) mediaPlayer.stop();
                mediaPlayer.release();
            } catch (Exception e) { e.printStackTrace(); }
            mediaPlayer = null;
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }
}
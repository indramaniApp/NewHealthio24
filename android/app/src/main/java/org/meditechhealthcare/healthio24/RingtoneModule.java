package org.meditechhealthcare.healthio24;

import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RingtoneModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RingtoneModule";
    private MediaPlayer mediaPlayer;

    public RingtoneModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RingtoneModule";
    }

    @ReactMethod
    public void playRingtone() {
        try {
            if (mediaPlayer != null) {
                mediaPlayer.stop();
                mediaPlayer.release();
                mediaPlayer = null;
            }

            Uri ringUri = Settings.System.DEFAULT_RINGTONE_URI;
            if (ringUri == null) ringUri = Settings.System.DEFAULT_NOTIFICATION_URI;

            mediaPlayer = new MediaPlayer();
            mediaPlayer.setDataSource(getReactApplicationContext(), ringUri);

            mediaPlayer.setAudioAttributes(
                    new AudioAttributes.Builder()
                            .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                            .build()
            );

            mediaPlayer.setLooping(true);
            mediaPlayer.setOnPreparedListener(mp -> {
                Log.d(TAG, "🔊 Ringtone Playing Started From JS!");
                mp.start();
            });

            mediaPlayer.prepareAsync();

        } catch (Exception e) {
            Log.e(TAG, "❌ MediaPlayer Error: " + e.getMessage());
        }
    }

    @ReactMethod
    public void stopRingtone() {
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.release();
            } catch (Exception e) {
                Log.e(TAG, "❌ Stop Ringtone Error: " + e.getMessage());
            }
            mediaPlayer = null;
            Log.d(TAG, "🛑 Ringtone Stopped From JS!");
        }
    }
}

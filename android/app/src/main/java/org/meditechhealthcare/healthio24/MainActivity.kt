package org.meditechhealthcare.healthio24

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "Healthio24"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    handleIncomingCallIntent()
    setupLockScreen()

    // 2. Sare Permissions ek sath mangna (Install ke baad pehli baar khulne par)
    checkAndRequestPermissions()
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent) // update getIntent() to the new intent for Linking
    handleIncomingCallIntent()
  }

  private fun handleIncomingCallIntent() {
    val stopIntent = Intent(this, CallForegroundService::class.java)
    stopIntent.action = "STOP_CALL_RINGTONE"
    startService(stopIntent)
  }

  private fun setupLockScreen() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
      setShowWhenLocked(true)
      setTurnScreenOn(true)
      val keyguardManager = getSystemService(android.content.Context.KEYGUARD_SERVICE) as android.app.KeyguardManager
      keyguardManager.requestDismissKeyguard(this, null)
    } else {
      window.addFlags(
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
        WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
        WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
        WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
      )
    }
  }

  private fun checkAndRequestPermissions() {
    // A. Battery Optimization (Background me app ko zinda rakhne ke liye)
    requestBatteryOptimizationIgnore()

    // B. Overlay Permission (Android 10+ background call popup ke liye)
    requestOverlayPermission()
  }

  private fun requestBatteryOptimizationIgnore() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      val pm = getSystemService(POWER_SERVICE) as PowerManager
      if (!pm.isIgnoringBatteryOptimizations(packageName)) {
        val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
        intent.data = Uri.parse("package:$packageName")
        startActivity(intent)
      }
    }
  }

  private fun requestOverlayPermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      if (!Settings.canDrawOverlays(this)) {
        val intent = Intent(
          Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
          Uri.parse("package:$packageName")
        )
        // Note: Ye user ko settings page pe le jayega, wahan unhe "Allow" karna hoga
        startActivity(intent)
      }
    }
  }
}
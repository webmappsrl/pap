
      import {CapacitorConfig} from '@capacitor/cli';
      const capacitorConfig: CapacitorConfig = {
  "appId": "it.netseven.portapporta",
  "appName": "PortAPPorta",
  "webDir": "dist/pap/",
  "bundledWebRuntime": false,
  "plugins": {
    "PushNotifications": {
      "presentationOptions": [
        "badge",
        "sound",
        "alert"
      ]
    },
    "SplashScreen": {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "backgroundColor": "#ffffffff",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true
    }
  }
}
      export default capacitorConfig;
      
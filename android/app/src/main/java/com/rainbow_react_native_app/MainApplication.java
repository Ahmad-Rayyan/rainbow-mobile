package com.rainbow_react_native_app;

import android.app.Application;

import com.ale.rainbowsdk.RainbowSdk;
import com.facebook.react.ReactApplication;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.oblador.keychain.KeychainPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.google.firebase.FirebaseApp;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import RainbowSDK.RainbowPackage;


public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new ReactNativeLocalizationPackage(),
                    new KeychainPackage(),
                    new ReactVideoPackage(),
                    new VectorIconsPackage(),
                    new RNGestureHandlerPackage(),
                    new RNSoundPackage(),
                    new RainbowPackage(),
                    new ReactNativeDocumentPicker()
            );
        }
        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        String applicationId = "65c681c01c8f11e9add8932b358ef81d";
        String applicationSecret = "UYdu3wCXTdfyjImhURnIkZ0tac5J9XSLszIKBRUUWVB35b6nT3fWV2BhAGhojdBQ";
        FirebaseApp.initializeApp(this);
        new ImNotificationManager(this);
        SoLoader.init(this, /* native exopackage */ false);
        RainbowSdk.instance().initialize(this, applicationId, applicationSecret);
        RainbowSdk.instance().setNotificationFactory(new NotificationFactory());
    }
}

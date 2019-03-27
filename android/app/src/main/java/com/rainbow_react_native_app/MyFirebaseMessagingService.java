package com.rainbow_react_native_app;

import android.util.Log;
import com.ale.rainbowsdk.RainbowSdk;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {
    @Override
    public void onNewToken(String refreshedToken) {
        super.onNewToken(refreshedToken);
        Log.e("NEW_TOKEN", refreshedToken);
        RainbowSdk.instance().push().onTokenRefresh(refreshedToken);
    }

    @Override
    public void onMessageReceived(RemoteMessage message) {
        RainbowSdk.instance().push().onMessageReceived(message.getData());
        super.onMessageReceived(message);
    }
}


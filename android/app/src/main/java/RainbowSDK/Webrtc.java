package RainbowSDK;

import android.content.Context;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.util.Log;

import com.ale.infra.contact.Contact;
import com.ale.infra.contact.IRainbowContact;
import com.ale.infra.list.ArrayItemList;
import com.ale.infra.manager.call.ITelephonyListener;
import com.ale.infra.manager.call.PeerSession;
import com.ale.infra.manager.call.WebRTCCall;
import com.ale.rainbow.phone.session.MediaState;
import com.ale.rainbowsdk.RainbowSdk;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.webrtc.MediaStream;
import org.webrtc.VideoTrack;

import java.util.List;
import java.util.Map;
import java.util.concurrent.FutureTask;

public class Webrtc extends ReactContextBaseJavaModule implements ITelephonyListener {

    private final static String TAG = Webrtc.class.getSimpleName();
    public ReactContext mReactContext;
    private VideoTrack local;
    private VideoTrack remote;

    public Webrtc(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Webrtc";
    }

    @Override
    public void onCallAdded(WebRTCCall call) {
        Log.d(TAG, "onCallAdded");
        WritableMap addedCall = Arguments.createMap();
        Contact callee =  call.getDistant();
        MediaState callStatus = call.getState();

        addedCall.putString("callState", String.valueOf(callStatus));
        addedCall.putString("contactJid",callee.getImJabberId());
        addedCall.putString("contactPic", ContactsHelper.getBses64Image(callee.getPhoto()));
        addedCall.putBoolean("wasInitiatedWithVideo", call.wasInitiatedWithVideo());
        sendEvent(mReactContext,"on_call_added",addedCall);

    }

    @Override
    public void onCallModified(WebRTCCall call) {
        Log.d(TAG, "onCallModified");
        WritableMap modifiedCall = Arguments.createMap();
        Boolean wasInitiatedWithVideo = call.wasInitiatedWithVideo();
        MediaState callState = call.getState();
        modifiedCall.putString("callState", String.valueOf(callState));
        modifiedCall.putBoolean("wasInitiatedWithVideo", wasInitiatedWithVideo);
        if(wasInitiatedWithVideo){
            local = RainbowSdk.instance().webRTC().getLocalVideoTrack();
            List<MediaStream> streams = RainbowSdk.instance().webRTC().getStreams(PeerSession.PeerSessionType.AUDIO_VIDEO_SHARING);
            if (streams.size() > 0) {
                remote = streams.get(0).videoTracks.get(0);
            }
        }
        Log.d(TAG, "onCallModified: "+ callState + " is video" +call.wasInitiatedWithVideo());
        sendEvent(mReactContext, "call_Modified", modifiedCall);
    }

    @Override
    public void onCallRemoved(WebRTCCall call) {
        Log.d(TAG, "onCallRemoved");
        WritableMap canceledCall = Arguments.createMap();
        MediaState callState = call.getState();

        canceledCall.putString("callState", String.valueOf(callState));

        sendEvent(mReactContext, "call_Declined", canceledCall);
    }

    VideoTrack getStreamForReactTag(String streamReactTag) {
        Log.d(TAG, "getStreamForReactTag");
        if (streamReactTag.startsWith("local")) {
            Log.d(TAG, "getStreamForReactTag local found streamReactTag" + streamReactTag);
            return this.local;
        } else {
            Log.d(TAG, "getStreamForReactTag remote found streamReactTag" + streamReactTag);
            return this.remote;
        }
    }

    @ReactMethod
    public void startCall(String requestCode, String contactJId) {
        IRainbowContact contact = RainbowSdk.instance().contacts().getContactFromJabberId(contactJId);
        Log.d(TAG, "startCall with: " + contact.getFirstName() + "with JId: " + contactJId + requestCode);
            if (contact != null) {
            switch (requestCode) {
                case "REQUEST_MAKE_VIDEO_CALL":
                    RainbowSdk.instance().webRTC().makeCall((Contact) contact, true, null);
                    break;
                case "REQUEST_MAKE_AUDIO_CALL":
                    RainbowSdk.instance().webRTC().makeCall((Contact) contact, false, null);
                    break;
            }

        }
    }

    @ReactMethod
    public void listenToTelephonyEvents() {
        Log.d(TAG, "listenToTelephonyEvents" + Webrtc.this);
        if (RainbowSdk.instance().webRTC() != null) {
            RainbowSdk.instance().webRTC().registerTelephonyListener(Webrtc.this);
        } else {
            Log.d(TAG, "listenToTelephonyEvents" + "Webrtc is null");
        }
    }

    @ReactMethod
    public void rejectCall(){
        Log.d(TAG, "rejectCall: recject the call and unregister Telephony listner");
        RainbowSdk.instance().webRTC().rejectCall();
    }
    @ReactMethod
    public void hangupCall(){
        Log.d(TAG, "hangupCall: ");
        RainbowSdk.instance().webRTC().hangupCall();
    }
    @ReactMethod
    public void takeCall(String requestCode){
        Log.d(TAG, "takeCall: " + requestCode);
        switch (requestCode) {
            case "REQUEST_TAKE_VIDEO_CALL":
                RainbowSdk.instance().webRTC().takeCall(true);
                break;
            case "REQUEST_TAKE_AUDIO_CALL":
                RainbowSdk.instance().webRTC().takeCall(false);
                break;
        }
    }

    // send events from webrtc java module to react native contacts component
    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        Log.d(TAG, "sendEvent: send " + eventName);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}

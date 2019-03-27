package RainbowSDK;
/* import android stuff */
import android.util.Log;
/* import facebook stuff */
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

public class Helper {
    /* Define the TAG of the class */
    public final static String TAG = Helper.class.getSimpleName();

    /* This method is used to send events to react native using bridge */
    public static void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableArray params) {
        Log.d(TAG, "sendEvent WritableArray " + eventName);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

}

package RainbowSDK;
/* import android stuff*/

import android.os.Build;
import android.support.annotation.RequiresApi;
import android.util.Log;
import android.util.Base64;
/* import rainbow stuff*/
import com.ale.infra.application.IApplicationData;
import com.ale.infra.application.RainbowContext;
import com.ale.infra.contact.IRainbowContact;
import com.ale.listener.SigninResponseListener;
import com.ale.listener.SignoutResponseListener;
import com.ale.listener.StartResponseListener;
import com.ale.rainbowsdk.RainbowSdk;
/* import facebook stuff*/
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
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

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.codec.digest.DigestUtils;
import org.json.JSONException;
import org.json.JSONObject;


public class Authentication extends ReactContextBaseJavaModule {
    /* Define the TAG of the class*/
    private final String TAG = Authentication.class.getSimpleName();
    /* Define the password of the user */
    private String password = "";
    /* Define the email of the user */
    private String email = "";
    /* Define the instance of the starter module*/
    private Starter starter;
    /* ReactNative Context */
    private ReactContext mReactContext;
    /* user token */
    private String token= "";
    RequestQueue m_queue;
    public Authentication(ReactApplicationContext reactContext) {
        super(reactContext);
        starter = new Starter(reactContext);
        mReactContext = reactContext;
    }

    /* This method is used to get the name of the module to b used from react-native */
    @Override
    public String getName() {
        return "Authentication";
    }

    /* This method will be used to authenticate the user using rainbow sdk */
    @ReactMethod
    public void authenticateUser(String email, String password, Promise promise) {
        this.email = email;
        this.password = password;
        IApplicationData applicationData = RainbowContext.getPlatformServices().getApplicationData();
        token = applicationData.getToken();
        validateCredentials(promise, token);

        Log.d(TAG, "authenticateUser: token "+applicationData.getServerUrl());
    }

    /* This method will be used to validate the credentials using rainbow sdk */
    private void validateCredentials(final Promise promise, String token) {
        RainbowSdk.instance().connection().start(new StartResponseListener() {
            @Override
            public void onStartSucceeded() {
                Log.d(TAG, "onStart connection was Succeeded");
                RainbowSdk.instance().connection().signin(email, password, "openrainbow.com", new SigninResponseListener() {
                    @RequiresApi(api = Build.VERSION_CODES.O)
                    @Override
                    public void onSigninSucceeded() {
                        // You are now connected
                        Log.d(TAG, "Sign in succeeded" );
                        starter.loadApplicationData();
                        WritableMap message = new WritableNativeMap();
                        message.putString("value", "Authentication Succeeded");
                        message.putString("status", "ok");
                        message.putString("token", token);
//                        message.putBoolean("isConnected",RainbowSdk.instance().connection().isConnected());
                        Log.d(TAG, "promise!" + promise + "\n" + "mesg" + message);
                        promise.resolve(message);
                    }

                    @Override
                    public void onRequestFailed(RainbowSdk.ErrorCode errorCode, String s) {
                        // Do something on the thread UI
                        Log.d(TAG, "Sign in Failed" + "\n" + errorCode + "\n" + s);
                        WritableMap message = new WritableNativeMap();
                        message.putString("value", "Authentication Failed!");
                        message.putString("status", "failed");
                        promise.resolve(message);
                    }
                });
            }

            @Override
            public void onRequestFailed(RainbowSdk.ErrorCode errorCode, String s) {
                // Something was wrong
                Log.d(TAG, "onStart Failed" + "\n" + errorCode + "\n" + s);
                WritableMap message = new WritableNativeMap();
                message.putString("status", "error");
                message.putString("value", "Connection Failed");
                promise.resolve(message);
            }
        });
    }
    /* This method will be used to get the connected User Data  */
    @ReactMethod
    public void getConnectedUser(){
        Log.d(TAG, "getConnectedUser: "+ RainbowSdk.instance().myProfile().getUserLoginInCache()+  RainbowSdk.instance().myProfile().getUserPasswordInCache());
        IRainbowContact connectedUser = RainbowSdk.instance().myProfile().getConnectedUser();
        String name = connectedUser.getFirstName() + " " + connectedUser.getLastName();
        String presence = connectedUser.getPresence().getPresence();
        String profilePic = RainbowSdk.instance().contacts().getAvatarUrl(connectedUser.getCorporateId());
        WritableArray connectedUserData = Arguments.createArray();
        WritableMap connectedUserMap = Arguments.createMap();
        connectedUserMap.putString("name",name);
        connectedUserMap.putString("profilePic",profilePic);
        connectedUserMap.putString("presence", presence);
        connectedUserData.pushMap(connectedUserMap);
        Helper.sendEvent(mReactContext, "connected_user_data", connectedUserData);

    }
    /* This method will be used to get the connected User Data  */
    @ReactMethod
    public void signOut(Promise promise){
        RainbowSdk.instance().connection().signout(new SignoutResponseListener() {
            @Override
            public void onSignoutSucceeded() {
                Log.d(TAG, "onSignoutSucceeded: connectedUser signOut");
                WritableMap message = new WritableNativeMap();
                message.putString("signoutStatus", "succeeded");
                promise.resolve(message);

            }
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    public void getToken() {

        try {
            Log.d(TAG, "getToken: ");
            String url = "https://openrainbow.com/api/rainbow/authentication/v1.0/login";
            String buffer = email + ":" + password;
            String authorizationString = "Basic " + new String(Base64.encode(buffer.getBytes(), Base64.NO_WRAP));

            String sha256 = new String(Hex.encodeHex(DigestUtils.sha256("FrzIUz7o4sVdOHfDrxkDjR4uvSadDuBjXFmMpEYXlLVLhidH8CMClIMXXr4DeQ5S" + password)));
            String base64 = new String(Base64.encode(("604a4600c64a11e8afffd16ffc46f36a" + ":" + sha256).getBytes(), Base64.NO_WRAP));
            String authorizationApplicationString = "Basic " + base64;
            JSONObject jsonObjBody = new JSONObject();
            jsonObjBody.put("authorization", authorizationString);
            jsonObjBody.put("x-rainbow-app-auth",authorizationApplicationString);
            jsonObjBody.put("accept","application/json");
            final String mRequestBody = jsonObjBody.toString();
            Log.d(TAG, "getToken: "+ mRequestBody);
//            JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
//                    (Request.Method.GET, url,jsonObjBody, new Response.Listener<JSONObject>() {
//
//                        @Override
//                        public void onResponse(JSONObject response) {
//                            Log.d(TAG, "onResponse getToken: " + response.toString());
//                        }
//                    }, new Response.ErrorListener() {
//
//                        @Override
//                        public void onErrorResponse(VolleyError error) {
//                            Log.d(TAG, "onErrorResponse: " + error);
//                        }
//
//                    });

// Access the RequestQueue through your singleton class.
//            m_queue.add(jsonObjectRequest);
        } catch (JSONException e) {
            Log.d(TAG, "getToken: JSONException"+e);
        }

    }
}

package RainbowSDK;
/* import android stuff */
import android.util.Log;
/* import rainbow stuff */
import com.ale.infra.application.RainbowContext;
import com.ale.infra.contact.Contact;
import com.ale.infra.contact.RainbowPresence;
import com.ale.infra.list.IItemListChangeListener;
import com.ale.infra.manager.Conversation;
import com.ale.rainbowsdk.RainbowSdk;
/* import facebook stuff */
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
/* import java stuff */
import java.util.List;
import javax.annotation.Nullable;

public class Starter extends ReactContextBaseJavaModule {

    /* Contacts Module */
    private ContactsHelper contactsHelper;
    /* Conversations Module */
    private ConversationsHelper conversationsHelper;
    /* List of rainbow conversations */
    private List<Conversation> conversations;
    /* List of rainbow contacts */
    private List<Contact> contacts;
    /* Define the Tag of the class */
    private final static String TAG = Starter.class.getSimpleName();
    /* ReactNative Context */
    private ReactContext mReactContext;

    public Starter(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        contactsHelper = new ContactsHelper(this.contactListener);
        conversationsHelper = ConversationsHelper.getInstance();
    }

    /* Define the name of the class to be used from react-native side */
    @Override
    public String getName() {
        return "Starter";
    }

    /* Conversations Listener that will be used to listen for conversations changes */
    public IItemListChangeListener conversationsChangeListener = new IItemListChangeListener() {
        @Override
        public void dataChanged() {
            Log.d(TAG, "conversationsChangeListener called");

            conversations = RainbowContext.getInfrastructure().getChatMgr().getConversations().getCopyOfDataList();
            Log.d(TAG, "conversationsChangeListener called " + conversations.size());
            WritableArray processedConversations = conversationsHelper.processConversations(conversations);
            Helper.sendEvent(mReactContext, "conversations_updated", processedConversations);
        }
    };
    /* Contacts Listener that will be used to listen for contacts changes */
    private IItemListChangeListener contactsChangeListener = new IItemListChangeListener() {

        @Override
        public void dataChanged() {
            contacts = RainbowContext.getInfrastructure().getContactCacheMgr().getRosters().getCopyOfDataList();
            Log.d(TAG, "contactsChangeListener called " + contacts.size());
            if (contacts != null && contacts.size() > 0) {
                WritableArray processedContacts= contactsHelper.processContacts(contacts);
                Helper.sendEvent(mReactContext, "contacts_updated", processedContacts);
            }
        }
    };
    /* Contact Listener that will be used to listen for each contact changes */
    private Contact.ContactListener contactListener = new Contact.ContactListener() {

        @Override
        public void contactUpdated(Contact contact) {
            Log.d(TAG, "contactListener contactUpdated called " + contact.getFirstName());
        }

        @Override
        public void onPresenceChanged(Contact contact, RainbowPresence rainbowPresence) {
            Log.d(TAG, "contactListener onPresenceChanged called " + contact.getFirstName() +" new presence is: " + rainbowPresence);
            WritableMap newPresence = Arguments.createMap();
            newPresence.putString("contactJId", contact.getImJabberId());
            newPresence.putString("status", String.valueOf(contact.getPresence()));
            sendEvent(mReactContext, "presence_updated", newPresence);
        }

        @Override
        public void onActionInProgress(boolean b) {

        }
    };

    /* This method will be used to load all the Application data at the startup of the APP */
     public void  loadApplicationData() {
        Log.d(TAG, "loadApplicationData");
         registerListeners();
        // Get rainbow conversations from rainbow SDK.
        conversations = conversationsHelper.getConversations();
        if (conversations.size() > 7){
            Log.d(TAG, "loadApplicationData conversations size > 0, send the event " + conversations.size());
            WritableArray processedConversations = conversationsHelper.processConversations(conversations);
            Helper.sendEvent(mReactContext, "conversations_updated", processedConversations);
        }
        // Get contacts from rainbow SDK.
        contacts = contactsHelper.getContacts();
        if (contacts.size() > 7){
            Log.d(TAG, "loadApplicationData contacts size > 0, send the event " + contacts.size());
            WritableArray processedContacts= contactsHelper.processContacts(contacts);
            Helper.sendEvent(mReactContext, "contacts_updated", processedContacts);
        }
    }

    /* This method is used to send events to react native using bridge */
    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        Log.d(TAG, "sendEvent WritableMap " + eventName);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    public void registerListeners(){
        Log.d(TAG, "registerListeners");
        // Register the conversations listener.
        RainbowSdk.instance().conversations().getAllConversations().registerChangeListener(conversationsChangeListener);
        // Register the contacts listener.
        RainbowSdk.instance().contacts().getRainbowContacts().registerChangeListener(contactsChangeListener);
    }

    public void unRegisterListeners(){
        Log.d(TAG, "unRegisterListeners");
        // Register the conversations listener.
        RainbowSdk.instance().conversations().getAllConversations().unregisterChangeListener(conversationsChangeListener);
        // Register the contacts listener.
        RainbowSdk.instance().contacts().getRainbowContacts().unregisterChangeListener(contactsChangeListener);
    }
}

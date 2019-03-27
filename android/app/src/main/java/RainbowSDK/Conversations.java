package RainbowSDK;

import android.net.Uri;
import android.util.Log;
/* import ale stuff */
import com.ale.infra.http.adapter.concurrent.RainbowServiceException;
import com.ale.infra.list.ArrayItemList;
import com.ale.infra.list.IItemListChangeListener;
import com.ale.infra.manager.IMMessage;
import com.ale.infra.manager.fileserver.IFileProxy;
import com.ale.infra.manager.fileserver.RainbowFileDescriptor;
import com.ale.infra.manager.room.Room;
import com.ale.infra.proxy.conversation.IRainbowConversation;
import com.ale.listener.IRainbowGetConversationListener;
import com.ale.rainbowsdk.RainbowSdk;
/* import facebook stuff */
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;

public class Conversations extends ReactContextBaseJavaModule {
    /* Define the TAG of the class */
    private final String TAG = Conversations.class.getSimpleName();
    /* Define current conversation */
    private IRainbowConversation currentConversation;
    /* Define conversation messages */
    private ArrayItemList<IMMessage> messages;
    /* Define size of messages chunk to retrieve from the server */
    private static final int NB_MESSAGES_TO_RETRIEVE = 10;
    private static final int NB_MESSAGES_TO_LOAD = 5;
    /* Conversations Module */
    private ConversationsHelper conversationsHelper;
    /* ReactNative Context */
    private ReactContext mReactContext;
    /* Peer contact name */
    private String peerContactName;
    /* Peer contact pic */
    private String peerContactPic;
    /* contact or conversation ID */
    String contactORConversationJId;
    /* Room or one to one conversation */
    Boolean isRoom;

    public Conversations(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        conversationsHelper = ConversationsHelper.getInstance();
    }

    /* Define te listener of the messages changes */
    private IItemListChangeListener messagesChangeListener = new IItemListChangeListener() {
        @Override
        public void dataChanged() {
            // Do something on the thread UI
            messages = currentConversation.getMessages();
            Log.d(TAG, "dataChanged message updates " + messages.getCount());
            WritableArray processedMessages = conversationsHelper.processMessages(messages, peerContactName, peerContactPic);
            Helper.sendEvent(mReactContext, "messages_updated", processedMessages);
        }
    };

    /* This method is used to get the name of the module to b used from react-native */
    @Override
    public String getName() {
        return "Conversations";
    }

    /* This method is used to open a conversation */
    @ReactMethod
    public void openConversation(ReadableMap conversation, Boolean openedFromConversation) {
        /* extract conversation data  */
        contactORConversationJId = openedFromConversation ? conversation.getString("contactORConversationJId") : conversation.getString("contactJId");
        isRoom = openedFromConversation ? conversation.getBoolean("isRoom") : false ;
        peerContactName = conversation.getString("contactName");
        peerContactPic =  conversation.getString("contactProfilePic");

        Log.d(TAG, "openConversation contactJId " + contactORConversationJId);

        if (!isRoom){
            RainbowSdk.instance().conversations().getConversationFromContact(contactORConversationJId, new IRainbowGetConversationListener() {
                @Override
                public void onGetConversationSuccess(IRainbowConversation conversation) {
                    // Do what you want with the conversation
                    Log.d(TAG, "onGetConversationSuccess called" + conversation.getMessages().getCount());

                    currentConversation = conversation;
                    fetchMessagesAndRegisterListener();
                }

                @Override
                public void onGetConversationError() {
                    // Manage the error
                    Log.d(TAG, "onGetConversationError called");
                }
            });
        } else {
            Room room = RainbowSdk.instance().conversations().getConversationFromId(contactORConversationJId).getRoom();
            RainbowSdk.instance().conversations().getConversationFromRoom(room, new IRainbowGetConversationListener() {
                @Override
                public void onGetConversationSuccess(IRainbowConversation conversation) {
                    Log.d(TAG, "onGetConversationSuccess called");

                    // Do what you want with the conversation
                    currentConversation = conversation;
                    fetchMessagesAndRegisterListener();
                }

                @Override
                public void onGetConversationError() {
                    // Manage the error
                    Log.d(TAG, "onGetConversationError called");
                }
            });
        }
    }

    /* This method will be used to unregister the listener of the messages changes */
    @ReactMethod
    public void unRegisterMessagesListener() {
        currentConversation.getMessages().registerChangeListener(messagesChangeListener);
    }
    /* This method will be used to fetch messages from the server and listen for new of them */
    private void fetchMessagesAndRegisterListener() {
        Log.d(TAG, "fetchMessagesAndRegisterListener");
        RainbowSdk.instance().im().getMessagesFromConversation(currentConversation, NB_MESSAGES_TO_RETRIEVE);
        currentConversation.getMessages().registerChangeListener(messagesChangeListener);
        RainbowSdk.instance().im().markMessagesFromConversationAsRead(currentConversation);
    }
    /* This method will be used to load more messages from the conversation */
    @ReactMethod
    public void loadMoreMessages(){
        RainbowSdk.instance().im().getMoreMessagesFromConversation(currentConversation, NB_MESSAGES_TO_LOAD);
    }

    @ReactMethod
    public void sendMessage(String message){
        RainbowSdk.instance().im().sendMessageToConversation(currentConversation, message);
    }

    @ReactMethod
    public void sendFile(String uri){
        Uri myUri = Uri.parse(uri);
        System.out.println("UPLOAD URI: "+uri+" URI: "+myUri);
        RainbowSdk.instance().fileStorage().uploadFileToConversation(currentConversation, myUri, "Hello from react :D", new IFileProxy.IUploadFileListener() {
            @Override
            public void onUploadSuccess(RainbowFileDescriptor fileDescriptor) {
                System.out.println("UPLOAD FILE SUCCESSFULLY");
            }

            @Override
            public void onUploadInProgress(int percent) {
                System.out.println("UPLOAD PERCENT: "+percent+"%");
            }

            @Override
            public void onUploadFailed(RainbowFileDescriptor rainbowFileDescriptor, RainbowServiceException e) {
                System.out.println("UPLOAD FIELD: "+e.getDetailsMessage());
            }

        });
    }
}

package RainbowSDK;
/* import android stuff */
import android.graphics.Bitmap;
import android.util.Log;
/* import rainbow stuff */
import com.ale.infra.application.RainbowContext;
import com.ale.infra.contact.Contact;
import com.ale.infra.list.ArrayItemList;
import com.ale.infra.manager.Conversation;
import com.ale.infra.manager.IMMessage;
import com.ale.infra.proxy.conversation.IRainbowConversation;
/* import facebook stuff */
import com.ale.rainbowsdk.RainbowSdk;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
/* import java stuff */
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class ConversationsHelper {
    /* Define the TAG of the class*/
    private final static String TAG = ConversationsHelper.class.getSimpleName();
    private static ConversationsHelper conversationsHelperInstance = null;

    private ConversationsHelper() {

    }

    /* This method is used to return rainbow conversations */
    public List<Conversation> getConversations() {
        Log.d(TAG, "getConversations called");
        return RainbowContext.getInfrastructure().getChatMgr().getConversations().getCopyOfDataList();
    }

    /* This method is used to process conversations with specific format */
    public WritableArray processConversations(List<Conversation> conversations) {
        /* Define the processed conversations array*/
        WritableArray processedConversations = Arguments.createArray();

        Log.d(TAG, "processConversations called");
        for (int i = 0; i < conversations.size(); i++) {

            WritableMap conversationMap = Arguments.createMap();
            IRainbowConversation conversation = conversations.get(i);
            IMMessage message = conversation.getLastMessage();
//            RainbowSdk.instance().im().getMoreMessagesFromConversation(conversation, 10);
////            Log.d(TAG, "processConversations:get message Count "+ conversation.getMessages().getCount());
            if (conversation.isRoomType()) {
                String name = conversation.getRoom().getName();
                Bitmap roomPic = conversation.getRoom().getPhoto();
                conversationMap.putString("contactProfilePic", null);
                conversationMap.putString("contactName", name);
                conversationMap.putString("contactORConversationJId", conversation.getId());

            } else {
                Log.d(TAG, "processConversations:presence "+ conversation.getContact().getPresence());
                String fulLName = conversation.getContact().getFirstName()+ " " + conversation.getContact().getLastName();
                Bitmap contactPic = conversation.getContact().getPhoto();
                conversationMap.putString("contactORConversationJId", conversation.getContact().getImJabberId());
                String profilePic = RainbowSdk.instance().contacts().getAvatarUrl(conversation.getContact().getCorporateId());
                conversationMap.putString("contactName", fulLName);
                conversationMap.putString("contactProfilePic", profilePic);
            }
            conversationMap.putString("lastMessage", message.getMessageContent());
            conversationMap.putString("date", String.valueOf(message.getMessageDate()));
            conversationMap.putBoolean("isRoom", conversation.isRoomType());
            conversationMap.putString("unreadMsgNb", Integer.toString(conversation.getUnreadMsgNb()));

            processedConversations.pushMap(conversationMap);
        }
        Log.d(TAG, "processConversations done" + processedConversations.size());
        return processedConversations;
    }
    /* This method is used to process conversation messages  with specific format */
    public WritableArray processMessages(ArrayItemList<IMMessage> messages, String peerContactName, String peerContactPic) {
        /* Define the processed conversations array*/
        WritableArray processedMessages = Arguments.createArray();
         Contact connectedUser = RainbowContext.getInfrastructure().getContactCacheMgr().getUser();
        String connectedUserImage = RainbowSdk.instance().contacts().getAvatarUrl(connectedUser.getCorporateId());
        String connectedUserName = connectedUser.getFirstName() + " " +connectedUser.getLastName();
        String contactJId = connectedUser.getImJabberId();
        Log.d(TAG, "processMessages called");
        for (int i = messages.getCount() -1 ; i >= 0 ; i--) {

            WritableMap messageMap = Arguments.createMap();
            WritableMap messageOwnerMap = Arguments.createMap();
            IMMessage message = messages.get(i);
            messageMap.putString("_id", message.getMessageId());
            messageMap.putString("text", message.getMessageContent());
            messageMap.putString("createdAt", String.valueOf(message.getMessageDate()));
            messageMap.putBoolean("isMine", message.isFromMaM());
            Log.d(TAG, "messageContent " + message.getMessageContent() + " " + message.isMsgSent());

            if(message.isMsgSent()){
                messageOwnerMap.putInt("_id", 1);
                messageOwnerMap.putString("name", connectedUserName);
                messageOwnerMap.putString("avatar", connectedUserImage);
            } else {
                messageOwnerMap.putInt("_id", 2);
                messageOwnerMap.putString("name", peerContactName);
                messageOwnerMap.putString("avatar", peerContactPic);
            }

            messageMap.putMap("user", messageOwnerMap);
            processedMessages.pushMap(messageMap);
        }
        Log.d(TAG, "processMessages done" + processedMessages.size());
        return processedMessages;
    }

    /* static method to create instance of Singleton class */
    public static ConversationsHelper getInstance() {
        if (conversationsHelperInstance == null)
            conversationsHelperInstance = new ConversationsHelper();
        return conversationsHelperInstance;
    }
}

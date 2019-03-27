package com.rainbow_react_native_app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Build;
import android.support.v4.app.NotificationCompat;
import com.ale.infra.contact.IRainbowContact;
import com.ale.infra.manager.IMMessage;
import com.ale.infra.proxy.conversation.IRainbowConversation;
import com.ale.listener.IRainbowImListener;
import com.ale.rainbowsdk.RainbowSdk;
import java.util.List;

public class ImNotificationManager implements IRainbowImListener {
    private Context m_context;

    public ImNotificationManager(Context context) {
        m_context = context;
        RainbowSdk.instance().im().registerListener(this);
    }

    @Override
    public void onImReceived(String conversationId , IMMessage message) {
        IRainbowConversation conversation = RainbowSdk.instance().conversations().getConversationFromId(conversationId);
        if (conversation != null) {
            displayNotification(conversation, message) ;
        }
    }

    @Override
    public void onImSent(String s, IMMessage imMessage) {

    }

    @Override
    public void isTypingState(IRainbowContact iRainbowContact, boolean b, String s) {

    }

    @Override
    public void onMessagesListUpdated(int i, String s, List<IMMessage> list) {

    }

    @Override
    public void onMoreMessagesListUpdated(int i, String s, List<IMMessage> list) {

    }

    private void displayNotification(IRainbowConversation conversation, IMMessage message) {
        String name ;
        Bitmap Pic ;
        if (conversation.isRoomType()) {
             name = conversation.getRoom().getName();
             Pic = conversation.getRoom().getPhoto();
        } else {
            name = conversation.getContact().getFirstName()+ " " + conversation.getContact().getLastName();
            Pic = conversation.getContact().getPhoto();
        }
        int NOTIFICATION_ID = (int) System.currentTimeMillis();
        NotificationManager mNotificationManager = (NotificationManager) m_context.getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(m_context, "4567")
                .setSmallIcon(R.drawable.default_contact)
                .setLargeIcon(Pic)
                .setContentTitle(name)
                .setContentText(message.getMessageContent())
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        NotificationCompat.InboxStyle inboxStyle = new NotificationCompat.InboxStyle();
        inboxStyle.setBigContentTitle(name);
        inboxStyle.addLine(message.getMessageContent());
        notificationBuilder.setStyle(inboxStyle);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelId = "4567";
            NotificationChannel channel = new NotificationChannel(channelId,
                    "Rainbow",
                    NotificationManager.IMPORTANCE_DEFAULT);
            mNotificationManager.createNotificationChannel(channel);
            notificationBuilder.setChannelId(channelId);
        }
        mNotificationManager.notify(NOTIFICATION_ID, notificationBuilder.build());
    }
}

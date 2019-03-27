package com.rainbow_react_native_app;

import com.ale.infra.contact.IContactCacheMgr;
import com.ale.infra.manager.ChatMgr;
import com.ale.infra.manager.IIMNotificationMgr;
import com.ale.infra.manager.INotificationFactory;
import com.ale.infra.xmpp.XMPPWebSocketConnection;
import com.ale.infra.xmpp.XmppConnection;

public class NotificationFactory implements INotificationFactory {
    @Override
    public IIMNotificationMgr getIMNotificationMgr() {
        return null;
    }

    @Override
    public void createIMNotificationMgr(XmppConnection xmppConnection, ChatMgr chatMgr, IContactCacheMgr iContactCacheMgr, XMPPWebSocketConnection xmppWebSocketConnection) {

    }

    @Override
    public void stopIMNotificationMgr() {

    }
}

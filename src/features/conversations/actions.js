import {
    CONVERSATIONS_UPDATED,
    MESSAGES_UPDATED,
    CLEAR_CHAT
} from './types';

export const conversationsUpdated = (conversations) => {
    console.log('conversationsUpdated');
    return {
        type: CONVERSATIONS_UPDATED,
        payload: conversations
    };
};
export const messagesUpdated = (messages) => {
    console.log('messagesUpdated');
    return {
        type: MESSAGES_UPDATED,
        payload: messages
    };
};
//This action is triggered when connecting to a different chat to clear existing messages in redux
export const clearChat = () => {
    console.log('clearChat');
    return {
        type: CLEAR_CHAT
    };
};

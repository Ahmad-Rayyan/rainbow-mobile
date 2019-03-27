import {
    CONVERSATIONS_UPDATED, MESSAGES_UPDATED, CLEAR_CHAT
} from './types';

const INITAL_STATE = {

    conversations: null,
    loadingConversations: true,
    loadingConversationMessages: true
};

export default (state = INITAL_STATE, action) => {
    console.log('Inside Action Reducer :', action.type);
    switch (action.type) {

        case CONVERSATIONS_UPDATED:
            return {
                ...state,
                conversations: action.payload,
                loadingConversations: false
            };
        case MESSAGES_UPDATED:
            return {
                ...state,
                messages: action.payload,
                messagesTime: Date.now(),
                loadingConversationMessages: false
            };
        case CLEAR_CHAT:
            return {
                ...state,
                messages: []
            };
        default:
            return state;
    }
};

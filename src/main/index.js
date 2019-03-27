import { combineReducers } from 'redux';
import AuthenticationReducer from '../features/authentication/reducer';
import ContactsReducer from '../features/contacts/reducer';
import ConversationsReducer from '../features/conversations/reducer';
import WebrtcReducer from '../features/webrtc/reducer';

export default combineReducers({
    authenticationReducer: AuthenticationReducer,
    contactsReducer: ContactsReducer,
    conversationsReducer: ConversationsReducer,
    webrtcReducer: WebrtcReducer
});

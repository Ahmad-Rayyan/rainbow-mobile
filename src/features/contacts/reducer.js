import {
    CONTACTS_UPDATED,
    UPDATE_PRESENCE

} from './types';

const INITAL_STATE = {
    contacts: null,
    contactPresence: null,
    loadingContacts: true,
};

export default (state = INITAL_STATE, action) => {

    switch (action.type) {

        case CONTACTS_UPDATED:
            return {
                ...state,
                contacts: action.payload,
                loadingContacts: false
            };
        case UPDATE_PRESENCE:
            return {
                ...state,
                contactPresence: action.payload
            };
        default:
            return state;
    }
};

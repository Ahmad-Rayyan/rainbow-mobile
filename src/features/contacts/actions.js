import {
    CONTACTS_UPDATED,
    UPDATE_PRESENCE,
} from './types';

export const contactsUpdated = (contacts) => {
    console.log('contactsUpdated');
    return {
        type: CONTACTS_UPDATED,
        payload: contacts
    };
};

export const updatePresence = (contactPresence) => {
    console.log('Inside update contact presence action creator:', contactPresence);
    return {
        type: UPDATE_PRESENCE,
        payload: contactPresence
    };
};

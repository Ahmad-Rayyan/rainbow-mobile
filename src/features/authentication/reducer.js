import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOADER_ACTION,
    LOGIN_WITH_TOKEN_SUCCESS,
    GET_CONNECTED_USER_DATA,
    LOG_OUT_SUCCESS
} from './types';
import Strings from '../../resources/localization/Strings';

const INITAL_STATE = {
    email: null,
    password: null,
    error: null,
    user: null,
    loading: false,
    isConnected: false,
    connectedUser: null
};

export default (state = INITAL_STATE, action) => {
    console.log('new action called', action.type);
    switch (action.type) {
        case EMAIL_CHANGED:
            return {
                ...state,
                error: '',
                email: action.payload
            };
        case PASSWORD_CHANGED:
            return {
                ...state,
                error: '',
                password: action.payload
            };
        case LOADER_ACTION:
            return {
                ...state,
                error: '',
                loading: true
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isConnected: true,
                loading: false
            };
        case LOGIN_FAIL:
            return {
                ...state,
                error: Strings.loginFaild,
                password: '',
                loading: false
            };
        case LOGIN_WITH_TOKEN_SUCCESS:
        return {
            ...state,
            token: action.payload,
            isConnected: true,
        };
        case GET_CONNECTED_USER_DATA:
        return {
            ...state,
            connectedUser: action.payload
        };
        case LOG_OUT_SUCCESS:
        return {
            ...state,
            user: null,
            isConnected: false,
            loading: false
        };
        default:
            return state;
    }
};

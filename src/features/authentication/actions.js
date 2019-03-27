import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOADER_ACTION,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGIN_WITH_TOKEN_SUCCESS,
    GET_CONNECTED_USER_DATA,
    LOG_OUT_SUCCESS
} from './types';
import { Actions } from 'react-native-router-flux';
import * as Keychain from 'react-native-keychain';
import { Authentication } from '../../main/RainbowNativeModules';

export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (password) => {
    return {
        type: PASSWORD_CHANGED,
        payload: password
    };
};

async function signOut(dispatch) {
    try {
        const data = await Authentication.signOut();
        if (data.signoutStatus == 'succeeded') {
            dispatch({
                type: LOG_OUT_SUCCESS,
                payload: data
            });
            Keychain.resetGenericPassword();
            Actions.login();
        }

    } catch (e) {
        console.log('logOutUser: something went Wrong', e)
    }
}
async function authenticateUser(dispatch, email, password) {
    try {
        const data = await Authentication.authenticateUser(email, password);
        if (data.status == 'failed') {
            dispatch({
                type: LOGIN_FAIL,
                payload: data
            });
        } else {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: data
            });
            storeConnectedUserData(email, password);
            Actions.main();
        }
    } catch (e) {
        console.log('Something Went Wrong: ', e);
    }
};
async function authenticateConnectedUser(dispatch, email, password) {
    console.log("authenticateConnectedUser");
  try {
      const data = await Authentication.authenticateUser(email, password);
      if (data.status == 'failed') {
          dispatch({
              type: LOGIN_FAIL,
              payload: data
          });
      } else {
          dispatch({
              type: LOGIN_SUCCESS,
              payload: data
          });
          Actions.main();
      }
  } catch (e) {
      console.log('Something Went Wrong: ', e);
  }
};
/** This function store the token and the authentication status for the connected user */
storeConnectedUserData = async (email, password) => {
    try {
        await Keychain.setGenericPassword(email, password).then(function(){
            console.log('Credentials saved successfully!');
        });
    } catch (error) {
        console.log('storeConnectedUserData: Something Went Wrong: ', error);
    }
  };
export const loginUser = (email, password) => {
    return (dispatch) => {
        // Start the spinner
        dispatch({
            type: LOADER_ACTION
        });
        authenticateUser(dispatch, email, password);
    };
};
/** Dispatch action to keep connected user logged in  */
export const KeepUserloggedIn = (email, password) => {
    console.log("KeepUserloggedIn");
    return (dispatch) => {
        authenticateConnectedUser(dispatch, email, password);
    };
};

export const logOutUser = () => {
    console.log('logOutUser action ');
    return (dispatch) => {
        // Start the spinner
        dispatch({
            type: LOADER_ACTION
        });
        signOut(dispatch);
    };
};

export const getConnectedUser = (connectedUser) => {
    console.log('getConnectedUser action', connectedUser);
    return {
        type: GET_CONNECTED_USER_DATA,
        payload: connectedUser
    }
}
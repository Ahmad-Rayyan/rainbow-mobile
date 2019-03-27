import { GET_CALL_STATE } from './types';

export const getCallState = (event) => {
    console.log('get call state');
    return {
        type: GET_CALL_STATE,
        payload: event
    };
};


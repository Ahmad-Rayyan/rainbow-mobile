export const LOADER_ACTION = 'view_loader';

export const viewLoader = () => {
    return (dispatch) => {
        dispatch({
            type: LOADER_ACTION
        });
    };
};

import jwt_decode from "jwt-decode";

export const setCurrentUser = token => {
    let decoded = jwt_decode(token)
    return {
        type: 'SET_CURRENT_USER',
        payload: decoded
    };
};

export const setUserLoading = () => {
    return {
        type: 'USER_LOADING'
    };
};

export const logoutUser = () => {
    return {
        type: 'LOGOUT_USER'
    };
};
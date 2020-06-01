import setAuthToken from "../utils/setAuthToken";
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

export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};
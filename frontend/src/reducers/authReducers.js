import setAuthToken from "../utils/setAuthToken";

const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

const authReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_CURRENT_USER':
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case 'USER_LOADING':
            return {
                ...state,
                loading: true
            };
        case 'LOGOUT_USER':
            localStorage.removeItem("jwtToken");
            setAuthToken(false);
            return state;
        default:
            return state;
    }
}

export default authReducer;
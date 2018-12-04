import { AUTH, } from "../constants/action-types";

const initialState = {
    auth: true,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH:
            return { ...state, auth: action.payload };
        default:
            return state;
    }
};

export default rootReducer
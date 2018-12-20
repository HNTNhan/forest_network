import { AUTH, WEBSITE, SYSTEMACTIVE, KEY } from "../constants/action-types";


const initialState = {
    auth: true,
    website: "",
    systemActive: false,
    key: "",
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH:
            return { ...state, auth: action.payload };
        case WEBSITE:
            return {...state, website: action.payload};
        case SYSTEMACTIVE:
            return {...state, systemActive: action.payload};
        case KEY:
            return {...state, key: action.payload};
        default:
            return state;
    }
};

export default rootReducer
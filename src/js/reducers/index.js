import {
    AUTH, WEBSITE, SYSTEMACTIVE, KEY, SEQUENCE, DATA, USERNAME, FOLLOWINGS, USERPOST, LOGOUT, ENERGY,
    USERPICTURE, FOLLOWER,
} from "../constants/action-types";

const initialState = {
    auth: false,
    website: "",
    systemActive: false,
    key: null,
    sequence: 0,
    data: null,
    userName: null,
    userPicture: null,
    followings: null,
    follower: null,
    userPost: 0,
    energy: null,
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
        case SEQUENCE:
            return {...state, sequence: action.payload};
        case DATA:
            return {...state, data: action.payload};
        case USERNAME:
            return {...state, userName: action.payload};
        case USERPICTURE:
            return {...state, userPicture: action.payload};
        case FOLLOWINGS:
            return {...state, followings: action.payload};
        case FOLLOWER:
            return {...state, follower: action.payload};
        case USERPOST:
            return {...state, userPost: action.payload};
        case ENERGY:
            return {...state, energy: action.payload};
        case LOGOUT:
            return initialState;
        default:
            return state;
    }
};

export default rootReducer
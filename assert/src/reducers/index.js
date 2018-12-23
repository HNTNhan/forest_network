import { combineReducers } from 'redux';

import userReducer from './userReducer';
import postReducer from './postReducer';
import followingReducer from './followingReducer';
import followerReducer from './followerReducer';

export default combineReducers({
    userReducer: userReducer,
    postReducer: postReducer,
    followingReducer,
    followerReducer
})
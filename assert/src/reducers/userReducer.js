import { UPDATE_USER_INFOR } from '../action/type';

const initialState = {
    username: 'Ngoc Bui',
    description: 'I want eat chao sã dịt kkk',
    location: 'Toc truong mien nui - Quang Ngai',
    school: 'Study in university of science',
    tweet :{
        number: 23,
        following: 1081,
        follower: 61,
        favorite: 2317,
        list: 1,
        moment: 4
    }
}

export default (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_USER_INFOR:
            return {
                ...action.payload};
        default:
            return state;
    }
}
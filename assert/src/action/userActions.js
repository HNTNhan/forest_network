import { UPDATE_USER_INFOR } from './type';

export const updateUser = (data) => {
    return {
        type: UPDATE_USER_INFOR,
        payload: data
    }
}
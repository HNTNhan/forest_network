import {
    AUTH,
    WEBSITE,
    SYSTEMACTIVE,
    KEY,
    SEQUENCE,
    DATA,
    USERNAME,
    FOLLOWINGS,
    USERPOST,
    LOGOUT,
    ENERGY,
    USERPICTURE, FOLLOWER, CREATEACCOUND, LASTTRANSICTION,
} from "../constants/action-types";

export const auth = bool => ({ type: AUTH, payload: bool });
export const logOut = () => ({ type: LOGOUT });
export const website = string => ({ type: WEBSITE, payload: string });
export const systemActive = bool => ({ type: SYSTEMACTIVE, payload: bool });
export const key = Keypair => ({ type: KEY, payload: Keypair });
export const sequence = int => ({ type: SEQUENCE, payload: int });
export const data = data => ({ type: DATA, payload: data });
export const userName = string => ({ type: USERNAME, payload: string });
export const userPicture = string => ({ type: USERPICTURE, payload: string });
export const followings = array => ({ type: FOLLOWINGS, payload: array });
export const userPost = array => ({ type: USERPOST, payload: array });
export const energy = object => ({ type: ENERGY, payload: object });
export const follower = object => ({ type: FOLLOWER, payload: object });
export const createAccount = array => ({ type: CREATEACCOUND, payload: array });
export const lastTransiction = int => ({ type: LASTTRANSICTION, payload: int });


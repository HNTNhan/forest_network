import {AUTH, WEBSITE, SYSTEMACTIVE, KEY, SEQUENCE, DATA, USERNAME, FOLLOWINGS} from "../constants/action-types";

export const auth = bool => ({ type: AUTH, payload: bool });
export const website = string => ({ type: WEBSITE, payload: string });
export const systemActive = bool => ({ type: SYSTEMACTIVE, payload: bool });
export const key = Keypair => ({ type: KEY, payload: Keypair });
export const sequence = int => ({ type: SEQUENCE, payload: int });
export const data = data => ({ type: DATA, payload: data });
export const userName = string => ({ type: USERNAME, payload: string });
export const followings = array => ({ type: FOLLOWINGS, payload: array });
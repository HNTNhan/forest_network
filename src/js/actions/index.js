import { AUTH, WEBSITE, SYSTEMACTIVE, KEY } from "../constants/action-types";

export const auth = bool => ({ type: AUTH, payload: bool });
export const website = string => ({ type: WEBSITE, payload: string });
export const systemActive = bool => ({ type: SYSTEMACTIVE, payload: bool });
export const key = Keypair => ({ type: KEY, payload: Keypair });
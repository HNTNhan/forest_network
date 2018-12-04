import { AUTH } from "../constants/action-types";

export const auth = bool => ({ type: AUTH, payload: bool });

import { atom } from "jotai";
import type {IUser} from "../types/auth.ts";

export const userAtom = atom<IUser>({
    role: null,
});
"use client";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const emailAtom = atom({
  key: "emailState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

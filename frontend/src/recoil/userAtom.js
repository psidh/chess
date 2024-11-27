// atoms/userAtom.ts
import { atom } from 'recoil';

export const userState = atom({
  key: 'userState',
  default: {
    email: null,
    isAuthenticated: false,
  },
});

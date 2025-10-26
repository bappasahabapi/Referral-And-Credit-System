import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  id: string;
  email: string;
  name?: string;
  referralCode?: string;
} | null;

type State = { user: User };
const initialState: State = { user: null };

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = slice.actions;
export default slice.reducer;

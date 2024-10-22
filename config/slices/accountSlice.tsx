import { Keys } from "@/constants/Keys";
import { AccountDTO } from "@/types/AccountDTO";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  userAccount: AccountDTO | null;
};
const initialState: InitialStateType = {
  userAccount: null,
};
const accountSlice = createSlice({
  name: "accountslice",
  initialState,
  reducers: {
    SET_ACCOUNT: (state, action) => {
      state.userAccount = action.payload;
    },
  },
});

export const { SET_ACCOUNT } = accountSlice.actions;
export default accountSlice.reducer;

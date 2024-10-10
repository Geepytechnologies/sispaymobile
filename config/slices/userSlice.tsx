import { Keys } from "@/constants/Keys";
import { loginResponseDTO } from "@/types/common/loginResponseDTO";
import { addToStore, getFromStore } from "@/utils/localstorage";
import { createSlice } from "@reduxjs/toolkit";

type InitialStateType = {
  currentuser: loginResponseDTO | null;
};
const initialState: InitialStateType = {
  currentuser: null,
};
const userSlice = createSlice({
  name: "userslice",
  initialState,
  reducers: {
    SIGNIN: (state, action) => {
      state.currentuser = action.payload;
    },
    SIGNOUT: (state) => {
      state.currentuser = null;
    },
  },
});

export const { SIGNIN, SIGNOUT } = userSlice.actions;
export default userSlice.reducer;

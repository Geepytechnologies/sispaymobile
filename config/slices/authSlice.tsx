import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: "",
    refreshToken: "",
  },
  reducers: {
    SET_TOKENS(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { SET_TOKENS } = authSlice.actions;
export default authSlice.reducer;

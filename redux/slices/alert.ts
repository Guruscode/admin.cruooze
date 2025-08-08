import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
  toggleAlert: boolean;
  code: string;
  message: string;
}

export const initialState: AlertState = {
  toggleAlert: false,
  code: "Success",
  message: "",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (
      state: AlertState,
      { payload }: PayloadAction<Omit<AlertState, "toggleAlert">>
    ) => {
      state.toggleAlert = true;
      state.message = payload.message;
      state.code = payload.code;

    },
    closeAlert: (state: AlertState) => {
      state.message = "";
      state.toggleAlert = false;
    },
  },
});

export const { setAlert, closeAlert } = alertSlice.actions;

export default alertSlice.reducer;

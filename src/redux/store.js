// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/authSlice";
import userReducer from "../store/usersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
});

export default store;

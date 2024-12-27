import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  notificationCount: 0,
  selectedGroupObject: null, // New state to store selected group object
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Existing reducers...
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userType = action.payload.userType;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.userType = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload.notificationCount;
    },
    // New reducer to set selected group object
    setSelectedGroupObject: (state, action) => {
      state.selectedGroupObject = action.payload;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setNotificationCount,
  setSelectedGroupObject, // Export the new action
} = authSlice.actions;

export default authSlice.reducer;

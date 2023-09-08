import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: User = {
  id: "",
  email: "",
  password: "",
  gender: "Masculino",
  photoUrl: "blank",
  logged: false,
  isVerified: false,
  username: "",
  posts: [
    {
      title: "Post N° 1",
      body: "Some Post... 1",
      author: "Author",
      date: "09-06-2023",
      photoUrl: "blank",
      postId: "0",
      reactions: {
        thumbsUp: {
          count: 0,
          reactedBy: [],
        },
        thumbsDown: {
          count: 0,
          reactedBy: [],
        },
        smile: {
          count: 0,
          reactedBy: [],
        },
        hooray: {
          count: 0,
          reactedBy: [],
        },
        unhappy: {
          count: 0,
          reactedBy: [],
        },
        heart: {
          count: 0,
          reactedBy: [],
        },
      }
    },
  ],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    setPhotoUrl: (state, action) => {
      state.photoUrl = action.payload;
    },
    setLogged: (state, action) => {
      state.logged = action.payload;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
  },
});

export const {
  setId,
  setEmail,
  setGender,
  setPhotoUrl,
  setLogged,
  setIsVerified,
  setUsername,
  setPassword,
  setPosts,
} = userSlice.actions;

export default userSlice.reducer;

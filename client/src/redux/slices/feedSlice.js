import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./appConfigSlice";
import { likeAndUnlikePost } from "./postsSlice";


export const getFeedData =  createAsyncThunk
('user/getFeedData', 
    async () => {
     try {
        // thunkAPI.dispatch(setLoading(true));
        const response = await axiosClient.get
        ('/user/getFeedData');
        console.log('userprofile',response)
        return response.result;
     } catch (error) {
        return Promise.reject(error);
     }
    //  finally{
    //     thunkAPI.dispatch(setLoading(false));
    //  }
});

export const followAndUnfollowUser =  createAsyncThunk
('user/followAndUnfollow', 
    async (body) => {
     try {
        // thunkAPI.dispatch(setLoading(true));
       const response =  await axiosClient.post
        ('/user/follow', body);
         return response.result.user;
     } catch (error) {
        return Promise.reject(error);
     }
    //  finally{
    //     thunkAPI.dispatch(setLoading(false));
    //  }
});











const feedSlice = createSlice({
    name:"feedSlice",
    initialState:{
    userProfile:{},
      feedData: { 
      posts: [],
    following: [],
    suggestions: []},
    },
    


  extraReducers:(builder) =>{
   builder.addCase(getFeedData.fulfilled, (state, action)=>{
    state.feedData = action.payload;
     })                                      
   .addCase(likeAndUnlikePost.fulfilled, (state, action)=>{
      const post = action.payload;
      const index = state?.feedData.posts
      .findIndex((item) => item._id === post._id);
     if(index != undefined && index!= -1){
        state.feedData.posts[index] = post;
      }
   })
//    .addCase(followAndUnfollowUser.fulfilled , (state,action)=>{
//        const user = action.payload;
//        const index = state?.feedData?.following.findIndex(item => item._id == user._id)
//        if( index!= -1){
//                  state?.feedData.following.splice(index, 1)
//        }
//        else{
//         state?.feedData.following.push(user)
//        }
//    })

.addCase(followAndUnfollowUser.fulfilled, (state, action) => {
        const user = action.payload;
        const index = state?.feedData?.following.findIndex(
          (item) => item._id === user._id
        );
        if (index !== -1) { 
          state?.feedData.following.splice(index, 1);
        } else {
          state?.feedData.following.push(user);
        }
        
        state.feedData.suggestions = state.feedData.suggestions.filter(
    (item) => item._id !== user._id
  );

  // (optional) agar tu unfollow karta hai to wapas suggestions me add karna hai:
  if (index !== -1) {
    state.feedData.suggestions.push(user);
  }
      });
  },
});

export default feedSlice.reducer;



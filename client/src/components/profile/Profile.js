import React, { useEffect, useState } from 'react'
import './Profile.scss'
import Post from '../post/Post'
import userImg from '../../assets/user.jpg'
import { useNavigate, useParams } from 'react-router-dom'
import CreatePost from '../createpost/CreatePost'
import { useDispatch, useSelector  } from 'react-redux'
import { getUserProfile } from '../../redux/slices/postsSlice'
import { followAndUnfollowUser } from '../../redux/slices/feedSlice'


const Profile = () => {
const navigate = useNavigate()
const userProfile = useSelector(state => state.postsReducer.userProfile); 
const myProfile = useSelector(state => state.appConfig.myProfile)
// console.log("userProfile from redux:", userProfile);
const feedData = useSelector((state) => state.feedDataReducer.feedData);

const params = useParams();
const dispatch = useDispatch();
const [isMyProfile, setIsMyProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false);



// useEffect(() => {
//   dispatch(getUserProfile({ userId: params.userId }));
//   setIsMyProfile(myProfile?._id === params.userId);
// }, [dispatch, myProfile, params.userId]);

// useEffect(() => {
//   setIsFollowing(
//     !!feedData?.followings?.find((item) => item?._id === params.userId)
//   );
// }, [feedData, params.userId]);


// useEffect(() => {
//     dispatch(
//       getUserProfile({
//         userId: params.userId,
//       }))
// setIsMyProfile(myProfile?._id === params.userId);
//     setIsFollowing(
//       feedData?.following?.find((item) => item?._id === params?.userId)
//     );
//   }, [myProfile, params.userId , feedData]);


  useEffect(() => {
  dispatch(getUserProfile({
    userId: params.userId,
  }));

  setIsMyProfile(myProfile?._id === params.userId);

  const isFollowingUser = feedData?.following?.find(
    (item) => item?._id === params.userId
  );
  setIsFollowing(isFollowingUser);
}, [myProfile, params.userId, feedData]);




 async function handleUserFollow(){
  dispatch(followAndUnfollowUser({
    userIdToFollow: params.userId
  }))
}
  return (
    <div className='Profile'>
      <div className='container'>
        <div className='left-box'>
           {isMyProfile && <CreatePost />}
           { userProfile?.posts?.map(post => <Post key={post._id}  post = {post}/>)}
        </div>
        <div className='right-box'>
          <div className='profile-card'>
            <img className='user-img' src= {userProfile?.avatar?.url} alt=''></img>
            <h3 className='user-name'> {userProfile?.name} </h3>
            <p><b>{userProfile?.bio}</b></p>
            <div className='follower-info'>
               {/* <h4>{ `${userProfile.followers.length || 0} Followers`} </h4>
               <h4>{ `${userProfile.following.length || 0} Following`}</h4> */}
               <h4>{ `${userProfile?.followers?.length || 0 } Followers`}</h4>
               <h4>{ `${userProfile?.following?.length || 0 } Following`}</h4>

            </div>
         
            {!isMyProfile && (
                <h5 
                onClick={handleUserFollow}
                className={
                  isFollowing 
                  ? "hover-link follow-link"
                  : "btn-primary"
                }> 
                {isFollowing ? "Unfollow" : "Follow"}
                </h5>
)}

            
            
            {isMyProfile && 
            <button
             className='btn-secondary update-profile' 
             onClick={()=>{navigate('/updateprofile')}}>update Profile
             </button> }
            
          </div>
            
        </div>
      </div>
    </div>
  )
}

export default Profile

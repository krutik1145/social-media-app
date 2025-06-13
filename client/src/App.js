import Login from "./pages/login/Login";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import RequireUser from "./components/RequireUser"
import Feed from "./components/feed/Feed";
import Profile from "./components/profile/Profile";
import UpdateProfile from "./components/updateprofile/UpdateProfile";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import LoadingBar from 'react-top-loading-bar'
import OnlyifNotLoggedIn from "./components/OnlyifNotLoggedIn";
import toast, {Toaster} from 'react-hot-toast'

export const TOAST_SUCCESS = 'toast_success'
export const TOAST_FAILURE = 'toast_failure'

function App() {

const isLoading = useSelector(state => state.appConfig.isLoading)
const toastData = useSelector(state => state.appConfig.toastData)
const LoadingRef = useRef(null);
 

useEffect(() => {
       if(isLoading){
      LoadingRef.current?.continuousStart(); 
 
       } else{
               LoadingRef.current?.complete(); 

       }
  }, [isLoading])

  // const LoadingRef = useRef(null);
  useEffect(() => {
       switch (toastData.type) {
      case TOAST_SUCCESS:
        toast.success(toastData.message);
        break;
      case TOAST_FAILURE:
        toast.error(toastData.message);
        break;

       
    }
  }, [toastData])
  
  return (
    <div className="App">
   <LoadingBar height={3} color='black' ref={LoadingRef} />
   <div><Toaster /></div>

    <Routes>
      <Route element={<RequireUser/>}>
        <Route  element = { <Home /> }  >
        <Route path="/" element= { <Feed /> } />
        <Route path="/profile/:userId" element= { <Profile /> } />
        {/* <Route path="profile/:userId" element={<Profile />} /> */}

        <Route path="/updateprofile" element= { <UpdateProfile/> } />

         </Route>
      </Route>
      
      {/* <Route element={<OnlyifNotLoggedIn />}> */}
      <Route path="/login" element = {<Login/> }  />
      <Route path="/signup" element = { <Signup/> }  />
       {/* </Route> */}
   
    </Routes>
    </div>
  );
}

export default App;

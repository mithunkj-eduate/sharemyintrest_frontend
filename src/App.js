import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./screens/Home";
import SingUpPage from "./compount/SingUpPage";
import Profile from "./screens/Profile";
import Login from "./compount/Login";
import PostDetail from "./compount/PostDetail";
import WelcomPage from "./compount/WelcomPage";
import FollowingPost from "./screens/FollowingPost";
import Header from "./compount/Header";
import UserProfile from "./screens/UserProfile";
import Post from "./screens/Post";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/authContex";
import PageNotFound from "./compount/PageNotFound";
import LinkPost from "./screens/LinkPost";
import { AppContext, AppProvider, useAppContext } from "./context/context";
import { useEffect } from "react";
import { payloadTypes } from "./context/reducer";
import axios from "axios";
import { BASEURL } from "./config/config";
import TestPage from "./screens/TestPage";
import ChatScreen from "./screens/ChatScreen";
import Chat from "./compount/ChatPage";
import intercepter from "./server/intercepter";

function MainPage() {
  return (
    <>
      {/* <Header /> */}
      {/* <Routes>
        <Route path="/welcom" element={<WelcomPage />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<SingUpPage />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
        <Route path={"/login"} element={<Login />}></Route>
     
        <Route path="/createpost" element={<Post />}></Route>
        <Route path="/postdetails" element={<PostDetail />}></Route>

        <Route path="/profile/:userId" element={<UserProfile />}></Route>
        <Route path="/followingpost" element={<FollowingPost />}></Route>
        <Route path="/linkpost/:id" element={<LinkPost />}></Route>

        <Route path={"*" || "/pagenotfound"} element={<PageNotFound />}></Route>
      </Routes> */}

      {/* <Route path="/createpost" element={<Createpost />}></Route> */}
      {/* <Route path={"*" || "/pagenotfound"} element={<PageNotFound />}></Route> */}
      <Routes>
        <Route path="/welcom" element={<WelcomPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SingUpPage />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/createpost" element={<Post pageType={"General"} />} />
        <Route path="/postdetails" element={<PostDetail />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/followingpost" element={<FollowingPost />} />
        <Route path="/linkpost/:id" element={<LinkPost />}></Route>
        <Route
          path="/chat/:conversationId/friend/:friendId"
          element={<Chat />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export { MainPage };

const App = () => {
  const { state } = useAppContext(AppProvider);
  console.log(state, "state", BASEURL, "BASEURL");
  // if (state.user && state.user.id) {
  //   return (
  //     <>
  //       <MainPage />
  //     </>
  //   );
  // } else {
  //   return (
  //     <>
  //       <Routes>
  //         <Route path="/" element={<WelcomPage />}></Route>
  //         <Route path="/welcom" element={<WelcomPage />}></Route>
  //         <Route path="/signup" element={<SingUpPage />}></Route>
  //         <Route path={"/login"} element={<Login />}></Route>
  //         {/* <Route
  //           path={"*" || "/pagenotfound"}
  //           element={<PageNotFound />}
  //         ></Route> */}
  //         <Route path="*" element={<PageNotFound />} />
  //       </Routes>
  //     </>
  //   );
  // }

  return (
    <>
      <Routes>
        {state.user && state.user.id ? (
          <Route path="/*" element={<MainPage />} />
        ) : (
          // <Route path="/" element={<Login />} />
          <Route path="/" element={<WelcomPage />}></Route>
        )}
        <Route path="/test" element={<TestPage />}></Route>
        {/* <Route path="/" element={<WelcomPage />}></Route> */}
        <Route path="/welcom" element={<WelcomPage />}></Route>
        <Route path="/signup" element={<SingUpPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/login/:userId" element={<Login />} />

        {/* <Route
          path={"*" || "/pagenotfound"}
          element={<PageNotFound />}
        ></Route> */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;

export const LoggedUser = () => {
  const { dispatch } = useAppContext(AppContext);

  const token = localStorage.getItem("smitoken") ?? "";

  const getUser = async () => {
    try {
      const res = await intercepter.get(`${BASEURL}/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.status === 200 && res.data?.data) {
        const userData = res.data.data;
        dispatch({
          type: payloadTypes.SET_USER,
          payload: {
            user: {
              id: userData._id,
              name: userData.userName,
              email: userData.email,
              // role: userData.role,
              ...userData,
            },
          },
        });
      } else {
        console.error("Failed to fetch user data:", res.data);
      }
    } catch (error) {
      console.error("Error setting user:", error);
      // dispatch({ type: payloadTypes.SET_USER, payload: { user: null } });
    }
  };

  useEffect(() => {
    if (token) getUser();
  }, [token]);
  return null;
};

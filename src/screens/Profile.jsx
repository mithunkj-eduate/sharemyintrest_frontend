import React, { useEffect, useState } from "react";
import axios from "axios";
import PostDetail from "../compount/PostDetail";
import ProfilePic from "../compount/ProfilePic";
import { config } from "../config/config";
import FollowingList from "../compount/FollowingList";
import FollowersList from "../compount/FollowersList";
import CarouselPage from "../compount/helper/CarouselPage";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../config/config";
import { AppContext, useAppContext } from "../context/context";
import Header from "../compount/Header";
import { useIsOnline } from "../hooks/useIsOnline";
import intercepter from "../server/intercepter";

function Profile() {
  const [comment, setComment] = useState("");
  const [url, setUrl] = useState();
  const [allPost, setAllPost] = useState([]);
  const [user, setUser] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [stories, setStories] = useState([]);
  const [isFollow, setIsFollow] = useState(false);
  const [postLength, setPostLength] = useState();
  const [loading, setLoading] = useState(false);
  const [ref, setRef] = useState(false);
  const { state } = useAppContext(AppContext);


  let limit = 20;
  // let skip = 0;

  const isOnline = useIsOnline();

  const fetchAllPost = async () => {
    if (loading === false) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.get(
        `${BASEURL}/user/${state.user.id}?limit=${limit}`,
        config
      );

      const resData = await res.data;
      const resDataPost = await resData.post;
      setAllPost(resDataPost);
      //setAllPost((allPost) => [...allPost, ...resDataPost]);

      setUser(resData.user);
      setUserFollowing(resData.user.following);
      setUserFollowers(resData.user.followers);
      setPostLength(resData.postLength);
      setStories(resData.stories);
     
      resData.user.followers.forEach((element) => {
        if (element._id === state.user?.id) {
          setIsFollow(true);
        }
      });
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.pageYOffset >=
      document.documentElement.scrollHeight
    ) {
      limit = limit + 20;
      //skip = skip + 6;
      fetchAllPost();
    }
  };

  const feactLike = async (id) => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.put(
        `${BASEURL}/post/like`,
        { postId: id },
        config
      );
      const resData = await res.data.data;
      const newData = allPost.map((posts) => {
        if (posts._id === resData._id) {
          return resData;
        } else {
          return posts;
        }
      });
      setAllPost(newData);
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const feactunLike = async (id) => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.put(
        `${BASEURL}/post/unlike`,
        { postId: id },
        config
      );
      const resData = await res.data.data;
      const newData = allPost.map((posts) => {
        if (posts._id === resData._id) {
          return resData;
        } else {
          return posts;
        }
      });
      setAllPost(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const feactComment = async (id) => {
    if (comment !== "") {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.put(
        `${BASEURL}/post/comment`,
        { text: comment, postId: id },
        config
      );
      const resData = await res.data.data;
      const newData = allPost.map((posts) => {
        if (posts._id === resData._id) {
          return resData;
        } else {
          return posts;
        }
      });
      setAllPost(newData);
      setComment("");
    }
  };

  const changeProfilePhoto = async () => {
    const formdata = new FormData();
    formdata.append("photo", url);
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const resPost = await intercepter.put(
        `${BASEURL}/user/uploadProfilePic`,
        formdata,
        config
      );
      const resData = await resPost.data.data;
      setUser(resData);

      alert("successfull");

      //window.location.reload();
    } catch (error) {
      console.log(error);
      alert("faled");
    }
  };

  const followUser = async (userId) => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.put(
        `${BASEURL}/user/follow`,
        { followId: userId },
        config
      );
      setIsFollow(true);
      const resData = await res.data.data;
      setUser(resData);
      setUserFollowing(resData.following);
      setUserFollowers(resData.followers);
    } catch (error) {
      console.log(error)
    }
  
  };

  const unfollowUser = async (userId) => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.put(
        `${BASEURL}/user/unfollow`,
        { followId: userId },
        config
      );
      setIsFollow(false);
      const resData = await res.data.data;
      setUser(resData);
      setUserFollowing(resData.following);
      setUserFollowers(resData.followers);
    } catch (error) {
      console.log(error)
    }
   
  };

  const deleteStory = async (id) => {
    // const res = await intercepter.put(
    //   "http://localhost:8000/user/deleteStory",
    //   { storyId: id },
    //   config1
    // );

  };

  useEffect(() => {
    if (state && state.user && state.user.id) {
      fetchAllPost();
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (url) {
      changeProfilePhoto();
    }
  }, [url]);

  return (
    <>
    <Header />
      <div className="container contenerUser">
        <div className="userInfo">
          <ProfilePic data={{ user, changeProfilePhoto, setUrl }} />
          <div className="userInfoBody">
            <h2>{state.user.userName}</h2>
            <div className="state.user">
              <p>{postLength ? postLength : "0"} Post</p>
              <div>
                {user.followers ? user.followers.length : "0"}
                <FollowersList
                  data={{
                    user,
                    userFollowers,
                    followUser,
                    unfollowUser,
                    isFollow,
                    ref,
                    setRef,
                  }}
                />
              </div>
              <div>
                {user.following ? user.following.length : "0"}
                <FollowingList
                  data={{
                    user,
                    userFollowing,
                    followUser,
                    unfollowUser,
                    isFollow,
                    ref,
                    setRef,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <hr />

        <CarouselPage
          item={stories}
          userData={state.user}
          deleteStory={deleteStory}
        />

        <div className="rowCard">
          {allPost && allPost.length ? allPost.map((item) => {
            return (
              <>
                <PostDetail
                  data={{
                    item,
                    comment,
                    setComment,
                    feactComment,
                    feactLike,
                    feactunLike,
                    allPost,
                  }}
                />
              </>
            );
          }) : 
          null
          }
        </div>
      </div>
    </>
  );
}

export default Profile;

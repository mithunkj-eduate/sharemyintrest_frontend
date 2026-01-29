import React from "react";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { CiFaceSmile } from "react-icons/ci";
import CommentData from "../compount/CommentData";
import { config } from "../config/config";
import Search from "./Search";
import { CarouselPage2 } from "../compount/helper/CarouselPage";
import { BASEURL } from "../config/config";
import { AppContext, useAppContext } from "../context/context";
import Header from "../compount/Header";
import { useIsOnline } from "../hooks/useIsOnline";

function FollowingPost() {
  const nav = useNavigate();
  const [allPost, setAllPost] = useState([]);
  const [refTrue, setRefTrue] = useState(false);
  // const [postId, setPostId] = useState("");
  // const [like, setLike] = useState(false);
  const [comment, setComment] = useState("");
  // const [loading, setLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [allStory, setAllStory] = useState([]);
  // const [openCarousel, setOpenCarousel] = useState(false);

  const { state } = useAppContext(AppContext);

  let limit = 3;
  let skip = 0;

  const isOnline = useIsOnline();

  const fetchAllPost = async () => {
   
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await axios.get(
        `${BASEURL}/user/followingpost?limit=${limit}&skip=${skip}`,
        config
      );
      const resData = await res.data;
      const resAllData = resData.data;

      // Avoid duplicate posts based on _id
      setAllPost((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post._id));
        const newUniquePosts = resAllData.filter(
          (post) => !existingIds.has(post._id)
        );
        return [...prevPosts, ...newUniquePosts];
      });

      setStories(resData.stories);

      // Fetch and set stories (assumed not paginated, so overwrite)
      const resStories = await axios.get(
        `${BASEURL}/stories/allStories`,
        config
      );

      setAllStory(resStories.data.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.pageYOffset + 1000 >=
      document.documentElement.scrollHeight
    ) {
      //limit = limit + 3;
      skip = skip + 3;
      fetchAllPost();
    }
  };

  const feactLike = async (id) => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await axios.put(
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
    }
  };

  const feactunLike = async (id) => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }

      const res = await axios.put(
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
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      if (comment !== "") {
        const res = await axios.put(
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.user && state.user.id) {
      fetchAllPost();
    }
    setRefTrue(true);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Header />
      <div className="conatiner ">
        <div className="col-lg-4 col-md-6 m-auto mb-5">
          <Search />
          <div className="d-flex" style={{ overflowX: "scroll" }}>
            {allStory?.map((items, index) => {
              return (
                <>
                  <CarouselPage2
                    // item={items.posts}
                    userData={items._id}
                    // authStory={stories}
                  />
                </>
              );
            })}
          </div>
          {allPost.map((item) => {
            return (
              <>
                {item.postedBy ? (
                  <>
                    <div>
                      <NavLink
                        to={
                          state.user?.id === item.postedBy._id
                            ? "/profile"
                            : `/profile/${item.postedBy._id}`
                        }
                        className="cardUserInfo"
                      >
                        <div className="postImgTop">
                          <img
                            alt=""
                            className="userImg"
                            src={
                              item.postedBy?.Photo
                                ? `${BASEURL}${item.postedBy?.Photo}`
                                : "/images/user.png"
                            }
                          />
                        </div>

                        <p className="cardUserName">
                          {item.postedBy?.userName}
                        </p>
                      </NavLink>
                    </div>

                    <figure>
                      <img
                        alt=""
                        src={
                          item.photo
                            ? `${BASEURL}${item.photo}`
                            : "/images/user.png"
                        }
                        className="userImg"
                      />
                    </figure>
                    <div className="p-2 ">
                      <div>
                        {item.likes.includes(state.user?.id) ? (
                          <span
                            onClick={() => {
                              feactunLike(item._id);
                            }}
                          >
                            <FcLike className="fs-2" />
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              feactLike(item._id);
                            }}
                          >
                            <AiOutlineHeart className="fs-2" />
                          </span>
                        )}
                      </div>
                      <p className="mb-0">{item.likes.length} Likes</p>
                      <pre>{item.body}</pre>
                      <p>{item.views.length} views</p>
                      <CommentData
                        values={{ item, comment, setComment, feactComment }}
                      />
                      <div className="d-flex gap-2 align-items-center">
                        <CiFaceSmile className="fs-2 " />
                        <textarea
                          placeholder="Add acomment"
                          id="comment"
                          value={comment}
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                          className="form-control"
                          name="textarea"
                          rows="1"
                          cols="40"
                          style={{ maxHeight: "30px" }}
                        ></textarea>
                        <button
                          className="btn btn-primary p-1"
                          onClick={() => {
                            feactComment(item._id);
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FollowingPost;

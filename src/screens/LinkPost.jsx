import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { config } from "../config/config";
import { BASEURL } from "../config/config";
import { AppContext, useAppContext } from "../context/context";
import { useIsOnline } from "../hooks/useIsOnline";
import Header from "../compount/Header";
// import { AiOutlineHeart } from 'react-icons/ai'
// import { FcLike } from 'react-icons/fc'
// import { CiFaceSmile } from 'react-icons/ci'

const LinkPost = () => {
  const params = useParams();
  const nav = useNavigate();

  const [post, setPost] = useState({});
  const { state } = useAppContext(AppContext);

  const isOnline = useIsOnline();

  const getPost = async (postId) => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await axios.get(`${BASEURL}/post/${params.id}`, config);
      const resData = await res.data.data;
      setPost(resData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (state.user && state.user.id) {
      getPost();
    }
  }, []);
  if (state.user && state.user.id && post) {
    return (
      <>
        <Header />

        <div className="container mt-1">
          <div className="row">
            <div className="col-lg-4 col-md-6 m-auto">
              <div>
                <NavLink
                  to={
                    state.user.id === post.postedBy?._id
                      ? "/profile"
                      : `/profile/${post.postedBy?._id}`
                  }
                  className="cardUserInfo"
                >
                  <div className="postImgTop">
                    <img
                      className="userImg"
                      src={
                        post.postedBy?.Photo
                          ? `${BASEURL}${post.postedBy?.Photo}`
                          : "/images/user.png"
                      }
                      alt="images"
                    />
                  </div>
                  <p className="">{post.postedBy?.userName}</p>
                </NavLink>
              </div>

              <figure>
                <img
                  src={
                    post?.photo ? `${BASEURL}${post.photo}` : "/images/user.png"
                  }
                  className="userImg"
                  alt="images"
                />
              </figure>
              {/* <div className="p-2 pb-2">
                    <div>
                      {post.likes.includes(state.user.id) ? (
                        <span
                          onClick={() => {
                            feactunLike(post?._id);
                          }}
                        >
                          <FcLike className="fs-2" />
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            feactLike(post?._id);
                          }}
                        >
                          <AiOutlineHeart className="fs-2" />
                        </span>
                      )}
                    </div>
                    <p className="mb-0">{post.likes.length} Likes</p>
                    <p className="mb-0">{post.body.slice(0, 50)}...</p>
                    <p>{post.views.length} views</p>
                    <CommentData
                      values={{ post, comment, setComment, feactComment }}
                    />
                    <div className="d-flex gap-2 align-posts-center">
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
                        className="btn button p-2"
                        onClick={() => {
                          feactComment(post?._id);
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default LinkPost;

import React, { useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { CiFaceSmile } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { FaCircleCheck } from "react-icons/fa6";
import _ from "lodash";
import { config, BASEURL, BASEURL2 } from "../config/config";
import { AppContext, useAppContext } from "../context/context";
import Header from "../compount/Header";
import CommentData from "../compount/CommentData";
import "../style/photofeed.css";
import { useIsOnline } from "../hooks/useIsOnline";
import intercepter from "../server/intercepter";

const Home = () => {
  const { state } = useAppContext(AppContext);
  const [allPost, setAllPost] = useState([]);
  const [comment, setComment] = useState("");
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [following, setFollowing] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [shareMessage, setShareMessage] = useState("");
  const [currentPostId, setCurrentPostId] = useState(null);
  const limit = 20;

  const isOnline = useIsOnline();

  const fetchAllPost = async () => {
    if (!isOnline) {
      alert("No internet connection. Please check your network.");
      return;
    }

    try {
      if (isLoading) return;
      setIsLoading(true);
      const res = await intercepter.get(
        `${BASEURL}/post/allposts?limit=${limit}&skip=${skip}`,
        config
      );
      const resData = res.data.data;
      setAllPost((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post._id));
        const newPosts = resData.filter((post) => !existingIds.has(post._id));
        return [...prevPosts, ...newPosts];
      });
    } catch (error) {
      console.error(error);
      alert("You must be logged in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = useCallback(
    _.debounce(() => {
      if (
        document.documentElement.clientHeight + window.pageYOffset + 1000 >=
        document.documentElement.scrollHeight
      ) {
        setSkip((prev) => prev + 20);
      }
    }, 200),
    []
  );

  useEffect(() => {
    fetchAllPost();
  }, [skip]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const feactLike = async (id) => {
    if (!isOnline) {
      alert("No internet connection. Please check your network.");
      return;
    }
    try {
      const res = await intercepter.put(
        `${BASEURL}/post/like`,
        { postId: id },
        config
      );
      const resData = res.data.data;
      setAllPost((prev) =>
        prev.map((post) => (post._id === resData._id ? resData : post))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const feactunLike = async (id) => {
    if (!isOnline) {
      alert("No internet connection. Please check your network.");
      return;
    }
    try {
      const res = await intercepter.put(
        `${BASEURL}/post/unlike`,
        { postId: id },
        config
      );
      const resData = res.data.data;
      setAllPost((prev) =>
        prev.map((post) => (post._id === resData._id ? resData : post))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const feactComment = async (id) => {
    if (!isOnline) {
      alert("No internet connection. Please check your network.");
      return;
    }
    if (!comment.trim()) return;
    try {
      const res = await intercepter.put(
        `${BASEURL}/post/comment`,
        { text: comment, postId: id },
        config
      );
      const resData = res.data.data;
      setAllPost((prev) =>
        prev.map((post) => (post._id === resData._id ? resData : post))
      );
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const getFollowingList = async () => {
    if (!isOnline) {
      alert("No internet connection. Please check your network.");
      return;
    }
    try {
      const res = await intercepter.get(`${BASEURL}/user/followList`, config);
      setFollowing(res.data.data[0].following);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowShare = (postId) => {
    setCurrentPostId(postId);
    setShowShareModal(true);
    getFollowingList();
  };

  const handleCloseShare = () => {
    setShowShareModal(false);
    setSelectedIds([]);
    setShareMessage("");
  };

  const handleSelectUser = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // const handleShareSubmitOld = async () => {
  //   if (!isOnline) {
  //     alert("No internet connection. Please check your network.");
  //     return;
  //   }
  //   try {
  //     const link = `${BASEURL2}/linkpost/${currentPostId}`;
  //     const formdata = new FormData();
  //     formdata.append("link", link);
  //     formdata.append("body", shareMessage);
  //     for (let id of selectedIds) {
  //       formdata.append("receivedBy", id);
  //     }
  //     const res = await intercepter.post(
  //       `${BASEURL}/messages/message`,
  //       formdata,
  //       config
  //     );
  //     if (res.status === 200) {
  //       alert("Message sent successfully");
  //       handleCloseShare();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleShareSubmit = async () => {
    if (!isOnline) {
      alert("No internet connection. Please check your network.");
      return;
    }
    try {
      const link = `${BASEURL2}/linkpost/${currentPostId}`;

      const res = await intercepter.post(
        `${BASEURL}/chat/share`,
        {
          receivers: selectedIds,
          text: link,
          messageType: "link",
        },
        config
      );

      if (res.data) {
        alert("Message sent successfully");
        handleCloseShare();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle image load to adjust container size
  const handleImageLoad = (e) => {
    const img = e.target;
    const container = img.parentElement;
    container.style.paddingTop = `${
      (img.naturalHeight / img.naturalWidth) * 100
    }%`;
  };
  console.log(BASEURL, BASEURL2);
  return (
    <>
      <Header />

      <div className="container feed-container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mx-auto">
            {allPost && allPost.length ? (
              allPost.map((item) =>
                item.postedBy ? (
                  <div key={item._id} className="feed-post">
                    <div className="feed-header d-flex align-items-center">
                      <NavLink
                        to={
                          state.user.id === item.postedBy._id
                            ? "/profile"
                            : `/profile/${item.postedBy._id}`
                        }
                        className="d-flex align-items-center text-decoration-none"
                      >
                        <img
                          className="user-img rounded-circle me-2"
                          src={
                            item.postedBy?.Photo
                              ? `${BASEURL}${item.postedBy?.Photo}`
                              : "/images/user.png"
                          }
                          alt="User"
                          loading="lazy"
                        />
                        <span className="fw-bold">
                          {item.postedBy?.userName}
                        </span>
                      </NavLink>
                    </div>

                    <div className="post-img-container">
                      <img
                        src={
                          item?.photo
                            ? `${BASEURL}${item.photo}`
                            : "/images/user.png"
                        }
                        className="post-img"
                        alt="Post"
                        loading="lazy"
                        onLoad={handleImageLoad}
                      />
                    </div>

                    <div className="feed-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          {item.likes.includes(state.user.id) ? (
                            <FcLike
                              className="fs-3 cursor-pointer"
                              onClick={() => feactunLike(item._id)}
                              aria-label="Unlike post"
                            />
                          ) : (
                            <AiOutlineHeart
                              className="fs-3 cursor-pointer"
                              onClick={() => feactLike(item._id)}
                              aria-label="Like post"
                            />
                          )}
                          <span>{item.likes.length} Likes</span>
                        </div>
                        <LuSend
                          className="fs-3 cursor-pointer"
                          onClick={() => handleShowShare(item._id)}
                          aria-label="Share post"
                        />
                      </div>
                      <p className="mb-1">{item.body.slice(0, 100)}...</p>
                      <p className="text-muted small">
                        {item.views.length} views
                      </p>

                      <CommentData
                        values={{ item, comment, setComment, feactComment }}
                      />
                      <div className="d-flex align-items-center gap-2 mt-2">
                        <CiFaceSmile className="fs-3" />
                        <textarea
                          placeholder="Add a comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="form-control comment-textarea"
                          rows="1"
                          aria-label="Comment input"
                        />
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => feactComment(item._id)}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null
              )
            ) : (
              <h2 className="text-center mt-5">No posts available</h2>
            )}
            {isLoading && (
              <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Modal show={showShareModal} onHide={handleCloseShare} centered>
          <Modal.Header closeButton>
            <Modal.Title>Share Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              placeholder="Write a message..."
              className="form-control mb-3 share-input"
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              aria-label="Share message input"
            />
            <p className="text-muted small mb-3">
              Select friends to share with:
            </p>
            {following.length > 0 ? (
              following.map((item) => (
                <div
                  key={item._id}
                  className="d-flex align-items-center gap-2 mb-2 cursor-pointer"
                  onClick={() => handleSelectUser(item._id)}
                >
                  {selectedIds.length ? (
                    <FaCircleCheck
                      className={`fs-5 ${
                        selectedIds.includes(item._id)
                          ? "text-primary"
                          : "text-muted"
                      }`}
                    />
                  ) : null}
                  <img
                    className="user-img rounded-circle"
                    src={
                      item.Photo
                        ? `${BASEURL}${item.Photo}`
                        : "/images/personicon.jpg"
                    }
                    alt="User"
                    loading="lazy"
                  />
                  <span>{item.userName}</span>
                </div>
              ))
            ) : (
              <p className="text-muted">No friends to share with.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseShare}>
              Cancel
            </Button>
            {selectedIds.length > 0 && (
              <Button variant="primary" onClick={handleShareSubmit}>
                Send
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Home;

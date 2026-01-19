import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import PostDetail from "../compount/PostDetail";
import { useNavigate, useParams } from "react-router-dom";
import { config } from "../config/config";
import FollowingList from "../compount/FollowingList";
import FollowersList from "../compount/FollowersList";
import CarouselPage from "../compount/helper/CarouselPage";
import { BASEURL } from "../config/config";
import { Modal } from "react-bootstrap";
import { CiFaceSmile } from "react-icons/ci";
import { GrGallery } from "react-icons/gr";
import { MdOutlineFileDownload } from "react-icons/md";
import { AppContext, useAppContext } from "../context/context";
import Header from "../compount/Header";

function UserProfile() {
  const { userId } = useParams();
  const { state } = useAppContext(AppContext);
  const [user, setUser] = useState("");
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollowers, setUserFollowers] = useState([]);
  const [allPost, setAllPost] = useState([]);
  const [isFollow, setIsFollow] = useState(false);
  const [comment, setComment] = useState("");
  const [postLength, setPostLength] = useState("");
  const [loading, setLoading] = useState("false");
  const [ref, setRef] = useState(false);
  const [stories, setStories] = useState([]);
  const nav = useNavigate();

  let limit = 10;
  // let skip = 0;

  const feactchUser = async () => {
    if (loading === false) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    try {
      const res = await axios.get(
        `${BASEURL}/user/${userId}?limit=${limit}`,
        config
      );

      const resData = await res.data;

      const resAllPost = await resData.post;

      setUser(resData.user);
      setStories(resData.stories);
      setUserFollowing(resData.user.following);
      setUserFollowers(resData.user.followers);
      setAllPost(resAllPost);
      //setAllPost((allPost) => [...allPost, ...resAllPost]);
      setPostLength(resData.postLength);

      resData.user.followers.forEach((element) => {
        if (element._id === state.user.id) {
          setIsFollow(true);
        }
      });
    } catch (error) {
      console.log(error);
      // alert(error.response.data.message);
      nav("/");
    }
  };

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.pageYOffset >=
      document.documentElement.scrollHeight
    ) {
      limit = limit + 10;
      //skip = skip + 10;
      feactchUser();
    }
  };

  const followUser = async (userId) => {
    try {
      const res = await axios.put(
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
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const res = await axios.put(
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
      console.log(error);
      alert(error.response.data.message);
    }
  };

  const feactLike = async (id) => {
    try {
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
      alert(error.response.data.message);
    }
  };

  const feactunLike = async (id) => {
    try {
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
      alert(error.response.data.message);
    }
  };

  const feactComment = async (id) => {
    try {
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
      alert(error.response.data.message);
    }
  };

  useEffect(() => {

    if (state.user && state.user?.id) {
      feactchUser();
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  return (
    <>
      <Header />
      <div className="container contenerUser">
        <div className="userInfo">
          <div className="userImgTop">
            <img
              alt=""
              className="innerImg"
              src={user?.Photo ? `${BASEURL}${user.Photo}` : "/images/user.png"}
            />
          </div>
          <div>
            <h2>{user?.userName}</h2>
            <div className="d-flex gap-2">
              <p>{postLength ? postLength : "0"} Post </p>
              <div className="d-flex gap-2">
                {user?.followers ? user.followers.length : "0"}{" "}
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
              <div className="d-flex gap-2">
                {user?.following ? user.following.length : "0"}
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
            <div className="d-flex justify-content-center">
              <button
                onClick={() => {
                  if (isFollow) {
                    unfollowUser(user._id);
                  } else {
                    followUser(user._id);
                  }
                }}
                className="btn button m-2 p-2"
              >
                {isFollow === false ? "Follow" : "Unfollow"}
              </button>
              <Message />
            </div>
          </div>
        </div>
        <hr />

        <CarouselPage item={stories} userData={user} />
        <div className="rowCard">
          {allPost.map((item) => {
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
                  }}
                />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default UserProfile;

//message model
function Message() {
  const { userId } = useParams();
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [fullscreen, setFullscreen] = useState(true);
  const [comment, setComment] = useState();
  const [file, setFile] = useState();
  const [url, setUrl] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //get messages
  const getMessages = async () => {
    try {
      const res = await axios.get(
        `${BASEURL}/messages/message?receivedBy=${userId}`,
        config
      );

      setMessages(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //message send post method
  //image send one time after image not delete in imege file not fix the bug
  const postMessage = async () => {
    const formdata = new FormData();
    if (comment) formdata.append("title", comment);
    formdata.append("receivedBy", userId);

    if (file) formdata.append("photo", file);
    try {
      const res = await axios.post(
        `${BASEURL}/messages/message`,
        formdata,
        config
      );
      getMessages();
    } catch (error) {
      console.log(error);
    }
  };

  //useRef hook select file
  const hiddenFileInput = useRef(null);
  const handalClick = () => {
    hiddenFileInput.current.click();
  };

  // const imageURL = URL.createObjectURL(messages)

  //download image get method
  const downloadFile = async (id) => {
    try {
      await fetch(`${BASEURL}/messages/downloadFile/${id}`, config)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch image");
          }
          // Read the response as blob data
          return response.blob();
        })
        .then((blob) => {
          // Create a blob URL for the image blob data
          const imageUrl = URL.createObjectURL(blob);
          // Set the src attribute of the image element to the blob URL
          // document.getElementById('image').src = imageUrl;

          // Create a link element
          const link = document.createElement("a");
          link.href = imageUrl;
          link.download = "sharemyinstrest.jpg"; // Set the filename here

          // Append the link to the document body
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Remove the link from the document body
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        className="btn button m-2 p-2"
        onClick={() => {
          handleShow();
          getMessages();
        }}
      >
        Message
      </button>

      <Modal show={show} fullscreen={fullscreen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <a href={imageURL} download="mithun_kj" >download</a> */}
          {messages.length > 0 ? (
            <>
              <div className="commentCardBody">
                <div className="col-md-4 m-auto">
                  {messages.map((postItem) => {
                    // Date object representing a specific date
                    const date = new Date(postItem.createdAt);
                    // Convert the date to local time (for example, Kolkata, India)
                    const localDateString = date.toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    });
                    let commentTime = localDateString.split(",");

                    return (
                      <>
                        <div key={postItem._id}>
                          {postItem.postedBy._id !== userId ? (
                            <>
                              <div className="message-orange">
                                <div className="d-flex flex-wrap gap-3 mb-2">
                                  <div className="postImgTop">
                                    <img
                                      alt=""
                                      className="userImg"
                                      src={
                                        postItem.postedBy?.Photo
                                          ? `${BASEURL}${postItem.postedBy?.Photo}`
                                          : "/images/user.png"
                                      }
                                    />
                                  </div>

                                  <p>{postItem.postedBy.userName}</p>
                                  <p className="messageDate">{`${commentTime[0]}`}</p>
                                </div>
                                <pre
                                  className={
                                    postItem.body ? "message-content" : "d-none"
                                  }
                                >
                                  {postItem.body}
                                </pre>
                                <div>
                                  <a
                                    className="text-break"
                                    href={postItem.link}
                                  >
                                    {postItem.link}
                                  </a>{" "}
                                </div>

                                <div className={postItem.photo ? "" : "d-none"}>
                                  <img
                                    alt=""
                                    className="userImg"
                                    src={
                                      postItem.photo
                                        ? `${BASEURL}${postItem.photo}`
                                        : "/images/user.png"
                                    }
                                  />
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                  <MdOutlineFileDownload
                                    className={
                                      postItem.photo
                                        ? "fs-2 p-1 bg-light rounded-circle"
                                        : "d-none"
                                    }
                                    onClick={() => downloadFile(postItem._id)}
                                  />
                                  <p className="messageTime ms-auto">{` ${commentTime[1]}`}</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="message-blue">
                                <div className="d-flex flex-wrap gap-3 mb-2">
                                  <div className="postImgTop">
                                    <img
                                      alt=""
                                      className="userImg"
                                      src={
                                        postItem.postedBy.Photo
                                          ? `${BASEURL}${postItem.postedBy.Photo}`
                                          : "/images/user.png"
                                      }
                                    />
                                  </div>
                                  <p>{postItem.postedBy.userName}</p>
                                  <p className="messageDate">
                                    {`${commentTime[0]} `}
                                  </p>
                                </div>
                                <pre className="message-content">
                                  {postItem.body}
                                </pre>
                                <div>
                                  <a
                                    className="text-break"
                                    href={postItem.link}
                                  >
                                    {postItem.link}{" "}
                                  </a>
                                </div>
                                <div
                                  className={
                                    postItem.photo ? "" : "d-none"
                                  }
                                >
                                  <img
                                    alt=""
                                    className="userImg"
                                    src={
                                      postItem.photo
                                        ? `${BASEURL}${postItem.photo}`
                                        : "/images/user.png"
                                    }
                                  />
                                </div>

                                <div className="d-flex justify-content-between mt-1">
                                  <MdOutlineFileDownload
                                    className={
                                      postItem.photo
                                        ? "fs-2 bg-light rounded-circle"
                                        : "d-none"
                                    }
                                    onClick={() => downloadFile(postItem._id)}
                                  />
                                  <p className="messageTime ms-auto">{`${commentTime[1]}`}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="col-md-4 m-auto p-2">
            <div className="w-25">
              <img alt="" src={url} />
            </div>
            <div className="d-flex gap-2 align-items-center">
              <CiFaceSmile className="fs-2" onClick={handalClick} />

              <textarea
                placeholder="Add message"
                id="comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                className="form-control"
                name="textarea"
                rows="1"
                cols="40"
                style={{ maxHeight: "120px" }}
              ></textarea>
              <GrGallery className="fs-2 text-light" onClick={handalClick} />
              <button
                onClick={() => {
                  postMessage();
                }}
                className="btn button p-2"
              >
                Post
              </button>
            </div>

            <input
              type="file"
              ref={hiddenFileInput}
              onChange={(e) => {
                setFile(e.target.files[0]);
                setUrl(URL.createObjectURL(e.target.files[0]));
              }}
              accept="image/*"
              className="form-control"
              style={{ display: "none" }}
            />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export { Message };

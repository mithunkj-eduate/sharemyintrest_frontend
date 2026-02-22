import axios from "axios";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { config } from "../config/config";
import CommentData from "./CommentData";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { BASEURL } from "../config/config";
import { AppContext, useAppContext } from "../context/context";
import { useIsOnline } from "../hooks/useIsOnline";
import intercepter from "../server/intercepter";
import { SafeImage } from "./helper/SafImage";

function PostDetail({ data }) {
  const [show, setShow] = useState(false);
  const { item, comment, setComment, feactComment, feactLike, feactunLike } =
    data;
  const { state } = useAppContext(AppContext);

  const nav = useNavigate();
  const isOnline = useIsOnline();
  
  const feacthDelete = async (postId) => {
    try {
      if (window.confirm("Do you really want to delete this post ?")) {
        if (!isOnline) {
          alert("No internet connection. Please check your network.");
          return;
        }
        const res = await intercepter.delete(
          `${BASEURL}/post/deletePost/${postId}`,
          config
        );
        nav("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="column" onClick={() => setShow(true)}>
       <SafeImage
          alt=""
          key={item._id}
          src={item.photo ? `${BASEURL}${item.photo}` : "/images/user.png"}
          className="innerImg"
        />
      </div>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-100w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {state.user?.userName}
          </Modal.Title>
          {state.user?.id === item.postedBy._id ? (
            <button
              onClick={() => {
                feacthDelete(item._id);
              }}
              className="btn btn-danger ms-3"
            >
              delete
            </button>
          ) : (
            ""
          )}
        </Modal.Header>

        <div className="fullImgTop">
         <SafeImage
            alt=""
            src={item.photo ? `${BASEURL}${item.photo}` : "/images/user.png"}
            className="userImg"
          />
        </div>
        <div className="p-2">
          {item.likes.includes(state.user.id) ? (
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
          <p className="cardTitle">{item.likes.length} Likes</p>
          <p className="cardTitle">{item.body}</p>
        </div>

        <CommentData values={{ item, comment, setComment, feactComment }} />
      </Modal>
    </>
  );
}

export default PostDetail;

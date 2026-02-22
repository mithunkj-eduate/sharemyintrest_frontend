import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { CiFaceSmile } from "react-icons/ci";
import "../style/message.css";
import { AppContext, useAppContext } from "../context/context";
import { BASEURL } from "../config/config";
import { timeAgo } from "./helper/utlity";
import { SafeImage } from "./helper/SafImage";

function CommentData({ values }) {
  const [show, setShow] = useState(false);
  const { item, comment, setComment, feactComment } = values;
  const {state} =useAppContext(AppContext)


  return (
    <>
      <button className="btn w-100 cardTitle" onClick={() => setShow(true)}>
        Veiw all {item.comments.length} comments
      </button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        className="bg-light"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {state.user?.userName}
          </Modal.Title>
        </Modal.Header>

        <div className="commentImgTop">
         <SafeImage alt="" src={item.photo ?`${BASEURL}${item.photo}` :"/images/user.png"} className="userImg" />
        </div>
        <p className="text-center mb-0">Commnets</p>
        <div className="commentCardBody">
          <div className="commentBody">
            {item.comments.map((postItem,index) => {
              // // Date object representing a specific date
              // const date = new Date(postItem.date);
              // // Convert the date to local time (for example, Kolkata, India)
              // const localDateString = date.toLocaleString("en-IN", {
              //   timeZone: "Asia/Kolkata",
              // });
              // let commentTime = localDateString.split(",");
              const commentTime = timeAgo(postItem.date);

              return (
              
                  <div key={index}>
                    {postItem.postedBy._id === state.user.id ? (
                      <>
                        <div className="message-orange">
                          <div className="d-flex flex-wrap gap-3 mb-2">
                            <div className="postImgTop">
                             <SafeImage alt=""
                                className="userImg"
                                src={
                                  postItem.postedBy.Photo
                                    ? `${BASEURL}${postItem.postedBy.Photo}`  
                                    : "/images/user.png"
                                }
                              />
                            </div>
                            <p>{postItem.postedBy.userName}</p>
                            <p className="messageDate">{`${commentTime}`}</p>
                          </div>
                          <pre className="message-content">
                            {postItem.comment}
                          </pre>
                          {/* <p className="messageTime">{` ${commentTime}`}</p> */}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="message-blue">
                          <div className="d-flex flex-wrap gap-3 mb-2">
                            <div className="postImgTop">
                             <SafeImage alt=""
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
                              {`${commentTime} `}
                            </p>
                          </div>
                          <pre className="message-content">
                            {postItem.comment}
                          </pre>
                          {/* <p className="messageTime">{`${commentTime[1]}`}</p> */}
                        </div>
                      </>
                    )}
                  </div>
                
              );
            })}
          </div>
          <div className="p-2">
            <div className="mb-2">
              <p className="cardTitle">{item.likes.length} Likes</p>
              <p className="cardTitle">{item.body}</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <CiFaceSmile className="fs-2 " />
              <textarea
                placeholder="Add comment"
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

              <button
                onClick={() => {
                  feactComment(item._id);
                }}
                className="btn button p-2"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CommentData;

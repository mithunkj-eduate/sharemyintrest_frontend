import "../../style/carousalContainer.css";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import { config, BASEURL } from "../../config/config";
import axios from "axios";
import { AppContext, useAppContext } from "../../context/context";

function CarouselPage({ item, userData: user, authStory, deleteStory }) {
  

  const userData = {
    id: user._id ? user._id : user.id ? user.id : "",
    ...user,
  };
  

  const [show, setShow] = useState(false);
  const { state } = useAppContext(AppContext);

  // const userStories = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${BASEURL}/stories/story/${userData.id}`,
  //       config
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <>
      {userData?.id ? (
        <>
          <div className="column" onClick={() => setShow(true)}>
            <div className="ms-3">
              <div className="postImgTop">
                <img
                  className="userImg"
                  src={
                    userData?.Photo
                      ? `${BASEURL}${userData.Photo}`
                      : "/images/user.png"
                  }
                  alt="followerImage"
                />
              </div>
              <p>{userData.userName}</p>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-100w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <div className="postImgTop">
            <img
              className="userImg"
              src={
                userData?.Photo
                  ? `${BASEURL}${userData.Photo}`
                  : "/images/user.png"
              }
              alt="followerImage"
            />
          </div>
          <pre className="ms-2">{userData?.userName}</pre>
          {/* <div>
            <button
              onClick={() => {
                deleteStory();
              }}
            >
              delete
            </button>
          </div> */}
        </Modal.Header>
        <Carousel fade>
          {item[0]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  item[0]?.photo
                    ? `${BASEURL}${item[0]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{item[0]?.body}</h3>

                <StoryViewersList userId={state.user?.id} story={item[0]} />
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {item[1]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  item[1]?.photo
                    ? `${BASEURL}${item[1]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{item[1]?.body}</h3>
                <StoryViewersList userId={state.user?.id} story={item[1]} />
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {item[2]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  item[2]?.photo
                    ? `${BASEURL}${item[2]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{item[2]?.body}</h3>
                <StoryViewersList userId={state.user?.id} story={item[2]} />
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {item[3]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  item[3]?.photo
                    ? `${BASEURL}${item[3]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{item[3]?.body}</h3>
                <StoryViewersList userId={state.user?.id} story={item[3]} />
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {item[4]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  item[4]?.photo
                    ? `${BASEURL}${item[4]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{item[4]?.body}</h3>
                <StoryViewersList userId={state.user?.id} story={item[4]} />
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {item[5]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  item[5]?.photo
                    ? `${BASEURL}${item[5]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{item[5]?.body}</h3>
                <StoryViewersList userId={state.user?.id} story={item[5]} />
              </Carousel.Caption>
            </Carousel.Item>
          )}
        </Carousel>
      </Modal>
    </>
  );
}

export default CarouselPage;

//storyViewers list model
function StoryViewersList({ story, userId }) {
  const [show, setShow] = useState(false);
  const [storyViewers, setStoryViewers] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //get viewerslist
  const getViewerslist = async () => {
    try {
      const res = await axios.get(
        `${BASEURL}/stories/storyViewerslist/${story._id}`,
        config
      );
      const resData = await res.data.data;
      setStoryViewers(resData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        className={story.postedBy === userId ? "btn button m-2 p-2" : "d-none"}
        onClick={() => {
          handleShow();
          getViewerslist();
        }}
      >
        {story.views.length} views
      </button>
      {/* <div>
       <GrFormView className={story.postedBy === userId ? "fs-2 text-light" : "d-none"}
        onClick={() => {
          handleShow();
          getViewerslist();
        }} />
    </div>  */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Story Viewers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {storyViewers.length > 0 ? (
            <>
              {storyViewers.map((item) => {
                return (
                  <>
                    <div>
                      <div className="d-flex flex-wrap gap-3 mb-2">
                        <div className="postImgTop">
                          <img
                            alt=""
                            className="userImg"
                            src={
                              item.Photo
                                ? `${BASEURL}${item.Photo}`
                                : "/images/user.png"
                            }
                          />
                        </div>
                        <p>{item.userName}</p>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export { StoryViewersList };

//following page following stories
function CarouselPage2({ userData: user }) {
  const { state } = useAppContext(AppContext);
  

  const userData = {
    id: user._id ? user._id : user.id ? user.id : "",
    ...user,
  };
  

  const [show, setShow] = useState(false);
  const [stories, setStories] = useState([]);

  const userStories = async () => {
    try {
      const res = await axios.get(
        `${BASEURL}/stories/story?userId=${state.user.id}&storyUserId=${userData.id}`,
        config
      );
      setStories(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {userData?.id ? (
        <>
          <div className="column" onClick={() => setShow(true)}>
            <div className="ms-3">
              <div className="postImgTop" onClick={userStories}>
                <img
                  className="userImg"
                  src={
                    userData?.Photo
                      ? `${BASEURL}${userData.Photo}`
                      : "/images/user.png"
                  }
                  alt="followerImage"
                />
              </div>
              <p>{userData.userName}</p>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-100w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <div className="postImgTop">
            <img
              className="userImg"
              src={
                userData?.Photo
                  ? `${BASEURL}${userData.Photo}`
                  : "/images/user.png"
              }
              alt="followerImage"
            />
          </div>
          <pre className="ms-2">{userData?.userName}</pre>
          {/* <div>
            <button
              onClick={() => {
                deleteStory();
              }}
            >
              delete
            </button>
          </div> */}
        </Modal.Header>
        <Carousel fade>
          {stories[0]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  stories[0]?.photo
                    ? `${BASEURL}${stories[0]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{stories[0]?.body}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {stories[1]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  stories[1]?.photo
                    ? `${BASEURL}${stories[1]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{stories[1]?.body}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {stories[2]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  stories[2]?.photo
                    ? `${BASEURL}${stories[2]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{stories[2]?.body}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {stories[3]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  stories[3]?.photo
                    ? `${BASEURL}${stories[3]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{stories[3]?.body}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {stories[4]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  stories[4]?.photo
                    ? `${BASEURL}${stories[4]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{stories[4]?.body}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          )}
          {stories[5]?.photo && (
            <Carousel.Item interval={1000}>
              <img
                src={
                  stories[5]?.photo
                    ? `${BASEURL}${stories[5]?.photo}`
                    : "/images/user.png"
                }
                className="d-block w-100"
                alt="..."
              />
              <Carousel.Caption>
                <h3>{stories[5]?.body}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          )}
        </Carousel>
      </Modal>
    </>
  );
}

export { CarouselPage2 };

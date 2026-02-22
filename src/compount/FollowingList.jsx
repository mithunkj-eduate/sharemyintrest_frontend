import { useState } from "react";
import { Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AppContext, useAppContext } from "../context/context";
import { BASEURL } from "../config/config";
import { SafeImage } from "./helper/SafImage";

function FollowingList({ data }) {
  const [show, setShow] = useState(false);
  const { user, userFollowing, ref, setRef } = data;
  const { state: globalState } = useAppContext(AppContext);


  const [state, setstate] = useState({
    query: "",
    list: [],
  });
  const handleChange = (e) => {
    const results = userFollowing.filter((item) => {
      if (e.target.value === "") {
        return userFollowing;
      } else {
        return item.userName
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      }
    });
    setstate({
      query: e.target.value,
      list: results,
    });
  };

  return (
    <>
      <p variant="primary" onClick={() => setShow(true)}>
        Following
      </p>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            {user.userName}
          </Modal.Title>
        </Modal.Header>
        <form className="p-3 ">
          <input
            onChange={handleChange}
            className="form-control"
            placeholder="Search UserName"
          />
        </form>
        <Modal.Body>
          <div>
            {state.query !== "" ? (
              <>
                <p>Search Result</p>
                {state.list.map((item, index) => {
                  return (
                    <div key={index}>
                      <NavLink
                        to={
                          globalState.user?.id === item._id
                            ? "/profile"
                            : `/profile/${item._id}`
                        }
                      >
                        <div
                          key={item._id}
                          className="d-flex gap-3 mb-2"
                          onClick={() => {
                            setstate({ query: "", list: "" });
                            setShow(false);
                            if (ref === false) {
                              setRef(true);
                            } else {
                              setRef(false);
                            }
                          }}
                        >
                          <div className="postImgTop">
                           <SafeImage
                              alt=""
                              className="userImg"
                              src={
                                item.Photo
                                  ? `${BASEURL}${item.Photo}`
                                  : "/images/personicon.jpg"
                              }
                            />
                          </div>
                          <p>{item.userName}</p>
                        </div>
                      </NavLink>
                    </div>
                  );
                })}
              </>
            ) : (
              ""
            )}
            Following
            {userFollowing !== "" ? (
              <>
                {userFollowing.map((item, index) => {
                  return (
                    <div key={index}>
                      <NavLink
                        to={
                          globalState.user?.id === item._id
                            ? "/profile"
                            : `/profile/${item._id}`
                        }
                      >
                        <div
                          key={item._id}
                          className="d-flex gap-3 mb-2"
                          onClick={() => {
                            if (ref === false) {
                              setRef(true);
                              setShow(false);
                            } else {
                              setRef(false);
                              setShow(false);
                            }
                          }}
                        >
                          <div className="postImgTop">
                           <SafeImage
                              alt=""
                              className="userImg"
                              src={
                                item.Photo
                                  ? `${BASEURL}${item.Photo}`
                                  : "/images/personicon.jpg"
                              }
                            />
                          </div>
                          <p>{item.userName}</p>
                        </div>
                      </NavLink>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FollowingList;

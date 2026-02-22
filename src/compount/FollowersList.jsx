import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { NavLink } from "react-router-dom";
import { BASEURL } from "../config/config";
import { SafeImage } from "./helper/SafImage";

function FollowersList({ data }) {
  const [show, setShow] = useState(false);
  const { user, userFollowers, ref, setRef } = data;


  const [state, setstate] = useState({
    query: "",
    list: [],
  });
  const handleChange = (e) => {
    const results = userFollowers.filter((item) => {
      if (e.target.value === "") {
        return userFollowers;
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
        Followers
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
                {state.list.map((item) => {
                  return (
                    <>
                      <NavLink
                        to={
                          state.user?.id === item._id
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
                    </>
                  );
                })}
              </>
            ) : (
              ""
            )}
            <p>Followers</p>
            {userFollowers !== "" ? (
              <>
                {userFollowers.map((item) => {
                  return (
                    <>
                      <NavLink
                        to={
                          state.user?.id === item._id
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
                                  ?`${BASEURL}${item.Photo}` 
                                  : "/images/personicon.jpg"
                              }
                            />
                          </div>
                          <p>{item.userName}</p>
                        </div>
                      </NavLink>
                    </>
                  );
                })}
              </>
            ) : (
              <>""</>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FollowersList;

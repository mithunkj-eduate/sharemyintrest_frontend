import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { VscDiffAdded } from "react-icons/vsc";
import { RiMovieFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { AppContext, useAppContext } from "../context/context";

function Header() {
  const nav = useNavigate();
  // const token = localStorage.getItem("smitoken");
  const { state } = useAppContext(AppContext);


  const loginStatus = () => {
    if (state.user && state.user.id) {
      return [
        <>
          <Nav.Link href="/" key={0}>
            <li className="navItem">Home</li>
          </Nav.Link>
          <Nav.Link href="/profile" key={1}>
            <li className="navItem">Profile</li>
          </Nav.Link>
          <Nav.Link href="/followingpost" key={2}>
            <li className="navItem">Following</li>
          </Nav.Link>
          <Nav.Link href="/createpost">
            <li className="navItem">Create Post</li>
          </Nav.Link>

          <li
            onClick={() => {
              localStorage.clear();
              nav("/login");
            }}
            className="navItem textPrimary"
            key={3}
          >
            Log Out
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <Nav.Link href="/signup" key={0}>
            <li className="navItem textPrimary">Signup</li>
          </Nav.Link>
          <Nav.Link href="/login" key={1}>
            <li className="navItem textPrimary">Login</li>
          </Nav.Link>
        </>,
      ];
    }
  };

  const loginStatusPhone = () => {
    if (state.user && state.user.id) {
      return [
        <>
          <Nav.Link href="/" key={0}>
            <AiFillHome className="fs-1 " />
          </Nav.Link>
          <Nav.Link href="/createpost" key={1}>
            <VscDiffAdded className="fs-1" />
          </Nav.Link>
          <Nav.Link href="/followingpost" key={2}>
            <RiMovieFill className="fs-1" />
          </Nav.Link>
          <Nav.Link href="/profile" key={3}>
            <CgProfile className="fs-1" />
          </Nav.Link>
          <LuLogOut
            className="fs-1 textPrimary"
            onClick={() => {
              localStorage.clear();
              nav("/login");
            }}
            key={4}
          />
        </>,
      ];
    } else {
      return [
        <>
          <Nav.Link href="/signup" key={0}>
            <li className="navItem textPrimary">Signup</li>
          </Nav.Link>
          <Nav.Link href="/login" key={1}>
            <li className="navItem textPrimary">Login</li>
          </Nav.Link>
        </>,
      ];
    }
  };
  return (
    <>
      <div className="container-fluid headerNavLarge sticky-top bg-light p-1">
        <div className="container">
          <div className="d-flex justify-content-between aligin-items-center">
            <div className="d-flex align-items-center">
              <div className="mt-2" style={{ width: "43px", height: "40px" }}>
                <img
                  alt=""
                  src="/icon.png"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="logoImgTop">
                <img
                  alt=""
                  src="/logo2.png"
                  style={{ width: "100%", height: "100%" }}
                  onClick={() =>
                    !state.user || !state.user.id ? nav("/login") : nav("/")
                  }
                />
              </div>
            </div>
            <ul className="navListLarg">{loginStatus()}</ul>
          </div>
        </div>
      </div>
      <div className="headerNavPhone sticky-top bg-light p-1">
        <div className="d-flex ms-1">
          <div className="mt-2" style={{ width: "36px", height: "32px" }}>
            <img
              alt=""
              src="/icon.png"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="logoImgTop ">
            <img
              alt=""
              src="/logo2.png"
              style={{ width: "100%", height: "100%" }}
              onClick={() =>
                !state.user || !state.user.id ? nav("/login") : nav("/")
              }
            />
          </div>
        </div>
        <ul className="navList">{loginStatusPhone()}</ul>
      </div>
    </>
  );
}

export default Header;

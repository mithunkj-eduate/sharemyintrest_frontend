import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { VscDiffAdded } from "react-icons/vsc";
import { RiMovieFill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { AppContext, useAppContext } from "../context/context";
import "../style/header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // ← this gives us current path
  const { state } = useAppContext(AppContext);

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const loginStatus = () => {
    if (state.user && state.user.id) {
      return (
        <>
          <Nav.Link href="/" className={`navItem ${isActive("/")}`}>
            Home
          </Nav.Link>

          <Nav.Link
            href="/profile"
            className={`navItem ${isActive("/profile")}`}
          >
            Profile
          </Nav.Link>

          <Nav.Link
            href="/followingpost"
            className={`navItem ${isActive("/followingpost")}`}
          >
            Following
          </Nav.Link>

          <Nav.Link
            href="/createpost"
            className={`navItem ${isActive("/createpost")}`}
          >
            Create Post
          </Nav.Link>

          {/* Optional: Logout as link/button */}
          {/* <li
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="navItem textPrimary pointer"
            style={{ cursor: "pointer" }}
          >
            Log Out
          </li> */}
        </>
      );
    } else {
      return (
        <>
          <Nav.Link
            href="/signup"
            className={`navItem textPrimary ${isActive("/signup")}`}
          >
            Signup
          </Nav.Link>
          <Nav.Link
            href="/login"
            className={`navItem textPrimary ${isActive("/login")}`}
          >
            Login
          </Nav.Link>
        </>
      );
    }
  };

  const loginStatusPhone = () => {
    if (state.user && state.user.id) {
      return (
        <>
          <Nav.Link href="/" className={`navItem ${isActive("/")}`}>
            <AiFillHome className="fs-1" />
          </Nav.Link>

          <Nav.Link
            href="/createpost"
            className={`navItem ${isActive("/createpost")}`}
          >
            <VscDiffAdded className="fs-1" />
          </Nav.Link>

          <Nav.Link
            href="/followingpost"
            className={`navItem ${isActive("/followingpost")}`}
          >
            <RiMovieFill className="fs-1" />
          </Nav.Link>

          <Nav.Link
            href="/profile"
            className={`navItem ${isActive("/profile")}`}
          >
            <CgProfile className="fs-1" />
          </Nav.Link>

          {/* <LuLogOut
            className="fs-1 textPrimary"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            style={{ cursor: "pointer" }}
          /> */}
        </>
      );
    } else {
      return (
        <>
          <Nav.Link
            href="/signup"
            className={`navItem textPrimary ${isActive("/signup")}`}
          >
            Signup
          </Nav.Link>
          <Nav.Link
            href="/login"
            className={`navItem textPrimary ${isActive("/login")}`}
          >
            Login
          </Nav.Link>
        </>
      );
    }
  };

  return (
    <>
      {/* Desktop version */}
      <div className="container-fluid headerNavLarge sticky-top bg-light p-1">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="mt-2" style={{ width: "43px", height: "40px" }}>
                <img
                  alt="icon"
                  src="/icon.png"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div className="logoImgTop">
                <img
                  alt="logo"
                  src="/logo2.png"
                  style={{ width: "100%", height: "100%" }}
                  onClick={() =>
                    !state.user || !state.user.id
                      ? navigate("/login")
                      : navigate("/")
                  }
                />
              </div>
            </div>

            <ul className="navListLarg">{loginStatus()}</ul>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="headerNavPhone sticky-top bg-light p-1">
        <div className="d-flex ms-1">
          <div className="mt-2" style={{ width: "36px", height: "32px" }}>
            <img
              alt="icon"
              src="/icon.png"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="logoImgTop">
            <img
              alt="logo"
              src="/logo2.png"
              style={{ width: "100%", height: "100%" }}
              onClick={() =>
                !state.user || !state.user.id
                  ? navigate("/login")
                  : navigate("/")
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

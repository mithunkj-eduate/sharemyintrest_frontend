import React, { useEffect } from "react";
import { Nav } from "react-bootstrap";
import Header from "./Header";
import axios from "axios";
import { BASEURL } from "../config/config";
import { payloadTypes } from "../context/reducer";
import { AppContext, useAppContext } from "../context/context";

function WelcomPage() {
  const { state } = useAppContext(AppContext);
  
  return (
    <>
      <Header />
      <div className="welcome ">
        <div className="container">
          <img alt="welcomimage" src="/logo2.png" style={{ width: "100%" }} />

          <p className="fs-4" style={{ color: "#8903fd" }}>
            Welcome to ShareMyInterest App
          </p>
          {state && state.user && state.user.id ? (
            <Nav.Link href="/">
              <button className="btn button m-2 p-2">Home</button>
            </Nav.Link>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default WelcomPage;

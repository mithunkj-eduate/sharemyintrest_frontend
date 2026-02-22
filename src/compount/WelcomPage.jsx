import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import Header from "./Header";
import axios from "axios";
import { BASEURL } from "../config/config";
import { payloadTypes } from "../context/reducer";
import { AppContext, useAppContext } from "../context/context";
import { useIsOnline } from "../hooks/useIsOnline";
import intercepter from "../server/intercepter";
import { SafeImage } from "./helper/SafImage";

function WelcomPage() {
  const { state } = useAppContext(AppContext);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const isOnline = useIsOnline();

  const handleTestApi = async () => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      
      const res = await intercepter.get(`${BASEURL}/test/check`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res.data);
      setData(toString(res.data.status));
    } catch (error) {
      console.log(error);
      setError("somthig error");
    }
  };

  const handleHealthCheckApi = async () => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.get(`${BASEURL}/health`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res.data);
      setData(res.data.status);
    } catch (error) {
      console.log(error);
      setError("somthig error");
    }
  };

  return (
    <>
      <Header />
      <div className="welcome ">
        <div className="container">
         <SafeImage alt="welcomimage" src="/logo2.png" style={{ width: "100%" }} />
          <p className="fs-4" style={{ color: "#8903fd" }}>
            Welcome to ShareMyInterest App
          </p>
          <button className="btn button m-2 p-2" onClick={handleTestApi}>
            Test Api
          </button>
          <button className="btn button m-2 p-2" onClick={handleHealthCheckApi}>
            Health Api
          </button>
          {state && state.user && state.user.id ? (
            <Nav.Link href="/">
              <button className="btn button m-2 p-2">Home</button>
            </Nav.Link>
          ) : null}
          <Nav.Link href="/test">
            <button className="btn button m-2 p-2">Test</button>
          </Nav.Link>
          <div>error: {error ? error : ""}</div>
          <div>data: {data ? data : ""}</div>
        </div>
      </div>
    </>
  );
}

export default WelcomPage;

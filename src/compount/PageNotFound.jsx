import React from "react";
import { Nav } from "react-bootstrap";
import { SafeImage } from "./helper/SafImage";

function PageNotFound() {
  return (
    <>
      <div className="container">
        <div className="col-lg-8 m-auto ">
         <SafeImage alt="pagenotfound"
            src="/images/pagenotfound.png"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <Nav.Link href="/">
              <button className="btn button m-2 p-2">Home</button>
            </Nav.Link>
      </div>
    </>
  );
}

export default PageNotFound;

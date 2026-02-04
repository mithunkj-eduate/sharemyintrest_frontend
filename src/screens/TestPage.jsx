import axios from "axios";
import React from "react";
import { BASEURL, config } from "../config/config";
import intercepter from "../server/intercepter";

const TestPage = () => {
  const bulkImport = async (id) => {
    try {
      const res = await intercepter.post(`${BASEURL}/auth/bulkRegister`, {}, config);
      const resData = res.data.data;
      console.log(resData)
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      TestPage
      {/* <button onClick={bulkImport}>Click</button> */}
    </div>
  );
};

export default TestPage;

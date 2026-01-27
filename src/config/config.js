export const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("smitoken")}`,
  },
};

export const config1 = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("smitoken")}`,
    "Content-Type": "multipart/form-data",
  },
};

// export const BASEURL = "http://localhost:8000/api";
// export const BASEURL2 = "http://localhost:3000/api";
export const BASEURL = process.env.REACT_APP_BACK_END_BASE_URL
  ? process.env.REACT_APP_BACK_END_BASE_URL
  : "http://localhost:8000/api";
export const BASEURL2 = process.env.REACT_APP_FRONT_END_BASE_URL
  ? process.env.REACT_APP_FRONT_END_BASE_URL
  : "http://localhost:3000/api";

// export const BASEURL = "https://api.shareurinterest.com/"
// export const BASEURL2 = "https://snap.shareurinterest.com/"

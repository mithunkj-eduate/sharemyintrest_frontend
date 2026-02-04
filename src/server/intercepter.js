import axios from "axios";

const intercepter = axios.create({
  baseURL: process.env.REACT_APP_BACK_END_BASE_URL,
  withCredentials: true,
});

// ---------------- REQUEST ----------------
intercepter.interceptors.request.use((config) => {
  const token = localStorage.getItem("smitoken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------- RESPONSE ----------------
intercepter.interceptors.response.use(
  (res) => res, // success → just return

  async (error) => {
    const originalReq = error.config;
    console.log(originalReq, error.response);
    // only handle 401 once
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        const refreshRes = await axios.get(
          `${process.env.REACT_APP_BACK_END_BASE_URL}/auth/token`,
          { withCredentials: true }
        );
         console.log("Refresh response:", refreshRes);
        const newToken = refreshRes.data.data;
        console.log("Token refreshed:", newToken);
        localStorage.setItem("smitoken", newToken);

        originalReq.headers.Authorization = `Bearer ${newToken}`;

        return intercepter(originalReq); // retry original request
      } catch (refreshErr) {
        console.log("Token refresh failed:", refreshErr);
        // logout if refresh fails
        localStorage.removeItem("smitoken");
        localStorage.removeItem("user");

        // window.location.href = "/login";

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default intercepter;

import { useContext, useEffect, useReducer } from "react";
import { createContext } from "react";
import { payloadTypes, reducer } from "./reducer";
import axios from "axios";
import { BASEURL } from "../config/config";
import { useIsOnline } from "../hooks/useIsOnline";
import intercepter from "../server/intercepter";

// ---------------- Initial State ----------------
export const initialState = {
  user: null,
  cart: [],
};

// ---------------- Context ----------------
export const AppContext = createContext({
  state: initialState,
  dispatch: () => null,
});

// ---------------- Provider ----------------
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isOnline = useIsOnline();

  const token = localStorage.getItem("smitoken") ?? "";

  const getUser = async () => {
    try {
      if (!isOnline) {
        alert("No internet connection. Please check your network.");
        return;
      }
      const res = await intercepter.get(`${BASEURL}/verify`);

      // const res = await intercepter.get(`${BASEURL}/verify`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });
      console.log("interceptor response", res);

      if (res.status === 200 && res.data?.data) {
        const userData = res.data.data;
        dispatch({
          type: payloadTypes.SET_USER,
          payload: {
            user: {
              id: userData._id,
              name: userData.userName,
              email: userData.email,
              // role: userData.role,
              ...userData,
            },
          },
        });
      } else {
        console.error("Failed to fetch user data:", res.data);
      }
    } catch (error) {
      console.error("Error setting user:", error);
      // dispatch({ type: payloadTypes.SET_USER, payload: { user: null } });
    }
  };

  useEffect(() => {
    if (token) getUser();
  }, [token]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export { AppProvider };

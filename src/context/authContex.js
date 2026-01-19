import React, { createContext, useContext } from "react";

const LoginCotext = createContext();

const AuthProvider = ({ children }) => {
  // const [auth, setAuth] = useState({});

  return (
    <>
      <LoginCotext.Provider value={"token"}>{children}</LoginCotext.Provider>
    </>
  );
};

const useLoginContext = () => {
  return useContext(LoginCotext);
};

export { AuthProvider, LoginCotext, useLoginContext };

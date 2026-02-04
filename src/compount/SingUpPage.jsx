import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
import { signUpSchema } from "./helper/Validation";
// import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { BASEURL } from "../config/config";
// import { errormessage, successmessage } from "./helper/Toastify";
import Header from "./Header";
import { useIsOnline } from "../hooks/useIsOnline";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Form, InputGroup } from "react-bootstrap";
import intercepter from "../server/intercepter";

const initialValues = {
  user: "",
  userName: "",
  mobileNumber: "",
  email: "",
  password: "",
  confirm_password: "",
};

function SingUpPage() {
  const isOnline = useIsOnline();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signUpSchema,

      onSubmit: async (values, action) => {
        delete values.confirm_password;
        try {
          if (!isOnline) {
            alert("No internet connection. Please check your network.");
            return;
          }
          setLoading(true);
          const res = await axios.post(`${BASEURL}/auth/register`, values);
          nav("/login");
        } catch (error) {
          console.log(error);
          // errormessage(error.response.data.message);
          alert(error.response.data.message);
        } finally {
          setLoading(false);
        }
        action.resetForm();
      },
    });

  const continueWithGoogle = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);
      const values = {
        name: decoded.name,
        userName: decoded.given_name,
        email: decoded.email,
        email_verified: decoded.email_verified,
        clientId: credentialResponse.clientId,
        Photo: decoded.picture,
      };
      const res = await axios.post(`${BASEURL}/auth/googleLogin`, values);

      localStorage.setItem("smitoken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // successmessage("login successfuly");
      alert("login successfuly");
      nav("/welcom");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto">
            <div className="border p-5 rounded ">
              <h1 className="section__title">Sign Up</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="mb-2 ">
                  <label htmlFor="user" className="form-label  mb-1 mb-1">
                    User
                  </label>
                  <input
                    type="text"
                    autoComplete="on"
                    name="user"
                    id="user"
                    placeholder="Enter User Name"
                    value={values.user}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  {errors.user && touched.user ? (
                    <p className="form-error ">{errors.user}</p>
                  ) : null}
                </div>
                <div className="mb-2 ">
                  <label htmlFor="userName" className="form-label  mb-1 mb-1">
                    User Name
                  </label>
                  <input
                    type="text"
                    autoComplete="on"
                    name="userName"
                    id="userName"
                    placeholder="Enter User Name"
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  {errors.userName && touched.userName ? (
                    <p className="form-error ">{errors.userName}</p>
                  ) : null}
                </div>
                <div className="mb-2">
                  <label htmlFor="mobileNumber" className="form-label  mb-1 ">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    autoComplete="on"
                    name="mobileNumber"
                    id="mobileNumber"
                    placeholder="Enter Mobile Number"
                    value={values.mobileNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  {errors.mobileNumber && touched.mobileNumber ? (
                    <p className="form-error">{errors.mobileNumber}</p>
                  ) : null}
                </div>
                <div className="mb-2">
                  <label htmlFor="email" className="form-label  mb-1 ">
                    Email
                  </label>
                  <input
                    type="email"
                    autoComplete="on"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  {errors.email && touched.email ? (
                    <p className="form-error">{errors.email}</p>
                  ) : null}
                </div>
                <div className="mb-2">
                  <label htmlFor="password" className="form-label  mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    autoComplete="on"
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  {errors.password && touched.password ? (
                    <p className="form-error">{errors.password}</p>
                  ) : null}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="confirm_password"
                    className="form-label  mb-1"
                  >
                    Confirm Password
                  </label>
                  <InputGroup className="mb-3">
                    <Form.Control
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      type={showPassword ? "text" : "password"}
                      autoComplete="on"
                      name="confirm_password"
                      id="confirm_password"
                      placeholder="Enter Confirm Password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control"
                    />
                    <InputGroup.Text id="basic-addon2">
                      {showPassword ? (
                        <FaEye onClick={() => setShowPassword(!showPassword)} />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      )}
                    </InputGroup.Text>
                  </InputGroup>
                  {/* <input
                    type="password"
                    autoComplete="on"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="Enter Confirm Password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  /> */}
                  {errors.confirm_password && touched.confirm_password ? (
                    <p className="form-error">{errors.confirm_password}</p>
                  ) : null}
                </div>

                <div className="text-center mt-2 mb-3 ">
                  <button className="btn button w-100 p-2" type="submit" disabled={loading}>
                    Sign Up
                  </button>
                </div>
                {/* <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    continueWithGoogle(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                /> */}
              </form>
              <p>
                Already have an account?
                <NavLink to="/login">Login now</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <ToastContainer /> */}
    </>
  );
}

export default SingUpPage;

import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { logInSchema } from "./helper/Validation";
import { BASEURL } from "../config/config";
import { errormessage, successmessage } from "./helper/Toastify";
import Header from "./Header";
const initialValues = {
  email: "",
  password: "",
};

function Login() {
  const nav = useNavigate();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: logInSchema,
      onSubmit: async (values, action) => {
        try {
          const res = await axios.post(`${BASEURL}/auth/login`, values, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });

          if (res && res.data && res.data.token) {
            
            localStorage.setItem("smitoken", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

           
            // successmessage("login successfuly");
            alert("login successfuly");
            nav("/welcom");
          }
        } catch (error) {
          if (error.response.data.message) {
            // errormessage(error.response.data.message);
            alert(error.response.data.message);
          } else {
            // errormessage("server error");
            alert("server error");
          }
        }
        action.resetForm();
      },
    });

  return (
    <>
      <Header />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 m-auto">
            <div className="border p-5 rounded">
              <h1 className="title">LogIn</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label htmlFor="email" className="form-label mb-1">
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
                <div className="mb-4 ">
                  <label htmlFor="password" className="form-label mb-1">
                    Password
                  </label>
                  <input
                    type="password"
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

                <div className="text-center mt-2 mb-3">
                  <button className="btn button w-100 p-2" type="submit">
                    Login
                  </button>
                </div>
                <div className="text-center">
                  <NavLink to="/signup">
                    <p>New User? Create an account</p>
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;

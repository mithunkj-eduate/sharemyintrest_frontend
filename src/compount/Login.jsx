import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { logInSchema } from "./helper/Validation";
import { BASEURL, BASEURL3 } from "../config/config";
// import { errormessage, successmessage } from "./helper/Toastify";
import Header from "./Header";
import { Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { SafeImage } from "./helper/SafImage";

const initialValues = {
  email: "",
  password: "",
};

function Login() {
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId } = useParams();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: logInSchema,
      onSubmit: async (values, action) => {
        try {
          setLoading(true);

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
            // nav("/welcom");
            window.location.href = "/";
          }
        } catch (error) {
          console.log(error);
          if (error.message) {
            setError(JSON.stringify(error.message, null, 2));
            alert(error.message);
          }
          if (error.response.data.message) {
            // errormessage(error.response.data.message);
            alert(error.response.data.message);
          } else {
            // errormessage("server error");
            alert("server error");
          }
        } finally {
          setLoading(false);
        }
        action.resetForm();
      },
    });

  const handaleSubmitSharemyinterest = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASEURL3}/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res, "res");

      if (res && res.data && res.data.data) {
        const userData = res.data.data;
        const body = {
          user: userData.name,
          userName: userData.name,
          clientId: userData.clientId,
          mobileNumber: userData.phoneNumber,
        };

        console.log(res, body);
        const result = await axios.post(
          `${BASEURL}/auth/laginWithShareMyInterest`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          },
        );

        if (result && result.data && result.data.token) {
          localStorage.setItem("smitoken", result.data.token);
          localStorage.setItem("user", JSON.stringify(result.data.user));

          // successmessage("login successfuly");
          // alert("login successfuly");
          // nav("/welcom");
          return (window.location.href = "/");
        }
      }
    } catch (error) {
      console.log(error);
      if (error.message) {
        setError(JSON.stringify(error.message, null, 2));
        alert(error.message);
      }
      if (error.response.data.message) {
        // errormessage(error.response.data.message);
        alert(error.response.data.message);
      } else {
        // errormessage("server error");
        alert("server error");
      }
    } finally {
      setLoading(false);
    }
  };

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
                  <InputGroup className="mb-3">
                    <Form.Control
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      type={showPassword ? "text" : "password"}
                      autoComplete="on"
                      name="password"
                      id="password"
                      placeholder="Enter Password"
                      value={values.password}
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
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  /> */}
                  {errors.password && touched.password ? (
                    <p className="form-error">{errors.password}</p>
                  ) : null}
                </div>

                <div className="text-center mt-2 mb-3">
                  <button
                    className="btn button w-100 p-2"
                    type="submit"
                    disabled={loading}
                  >
                    Login
                  </button>
                </div>
                <div className="text-center">
                  <NavLink to="/signup">
                    <p>New User? Create an account</p>
                  </NavLink>
                </div>
              </form>
              {userId && (
                <div className="text-center mt-2 mb-3">
                  <div
                    className="mt-2 d-flex"
                    style={{ width: "43px", height: "40px" }}
                    onClick={() => {
                      handaleSubmitSharemyinterest();
                    }}
                    disabled={loading}
                  >
                    <SafeImage
                      alt="icon"
                      src="/icon.png"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>{" "}
                </div>
              )}
            </div>
          </div>

          {error ? error : ""}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Login;

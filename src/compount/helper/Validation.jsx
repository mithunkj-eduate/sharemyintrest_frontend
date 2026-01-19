import * as Yup from "yup";

const mobileRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
// const uniquePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export const signUpSchema = Yup.object({
  user: Yup.string().min(2).max(10).required("Please enter your name"),
  userName: Yup.string()
    .min(2)
    .max(16)
    .trim("The name cannot include spaces")
    .strict(true)
    .required("Please enter your name"),
  mobileNumber: Yup.string()
    .min(10)
    .max(10)
    .matches(mobileRegExp, "mobile number is not valid")
    .required("Please enter your mobile number"),
  email: Yup.string().email().required("Please enter your email"),
  // password: Yup.string()
  //   .required("Please Enter your password")
  //   .matches(
  //     uniquePassword,
  //     "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
  //   ),
  // confirm_password: Yup.string()
  //   .required()
  //   .oneOf([Yup.ref("password"), null], "Password must match"),
});

export const logInSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

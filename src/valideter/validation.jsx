import * as Yup from "yup";

const mobileRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const signUpSchema = Yup.object({
  userName: Yup.string().min(2).max(25).required("Please enter your name"),
  mobileNumber: Yup.string()
    .matches(mobileRegExp, "mobile number is not valid")
    .required("Please enter your mobile number"),
  email: Yup.string().email().required("Please enter your email"),
  password: Yup.string().min(6).required("Please enter your password"),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Password must match"),
  shopName: Yup.string().min(2).max(25).required("Please enter your shopname"),
  shopAddress: Yup.string()
    .min(5)
    .max(80)
    .required("Please enter your shopaddress"),
  city: Yup.string().required("Please enter your city"),
  pincode: Yup.number().required("Please enter pincode"),
});

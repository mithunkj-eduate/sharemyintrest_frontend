// import axios from "axios";
// import React, { useEffect, useRef, useState } from "react";
// import Header from "../compount/Header";
// import { useNavigate } from "react-router-dom";
// import { config } from "../config/config";

// function Createpost() {
  
//   const [image, setImage] = useState();
//   const [title, setTitle] = useState();
//   const [url, setUrl] = useState();
//   const [loading, setLoading] = useState(false);
//   const nav = useNavigate();
//   const token = localStorage.getItem("smitoken");

//   let user;
//   if (token) {
//     user = JSON.parse(localStorage.getItem("user"));
//     console.log("this is creayte post if ");
//   } else {
//     user = "";
//   }
//   console.log("this is creayte post 4");
//   // let user = JSON.parse(localStorage.getItem("user"));

//   //========================= image resize ==========================//
//   const [userInfo, setuserInfo] = useState({
//     file: [],
//     filepreview: null,
//   });

//   const [invalidImage, setinvalidImage] = useState(null);
//   let reader = new FileReader();
//   const handleInputChange = (event) => {
//     const imageFile = event.target.files[0];
//     const imageFilname = event.target.files[0].name;

//     if (!imageFile) {
//       setinvalidImage("Please select image.");
//       return false;
//     }

//     if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
//       setinvalidImage("Please select valid image JPG,JPEG,PNG");
//       return false;
//     }
//     reader.onload = (e) => {
//       const img = new Image();
//       img.onload = () => {
//         //------------- Resize img code ------------------------//
//         var canvas = document.createElement("canvas");
//         var ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);

//         var MAX_WIDTH = 500;
//         var MAX_HEIGHT = 500;
//         var width = img.width;
//         var height = img.height;

//         if (width > height) {
//           if (width > MAX_WIDTH) {
//             height *= MAX_WIDTH / width;
//             width = MAX_WIDTH;
//           }
//         } else {
//           if (height > MAX_HEIGHT) {
//             width *= MAX_HEIGHT / height;
//             height = MAX_HEIGHT;
//           }
//         }
//         canvas.width = width;
//         canvas.height = height;

//         ctx.drawImage(img, 0, 0, width, height);
//         ctx.canvas.toBlob(
//           (blob) => {
//             const file = new File([blob], imageFilname, {
//               type: "image/jpeg",
//               lastModified: Date.now(),
//             });
//             setuserInfo({
//               ...userInfo,
//               file: file,
//               filepreview: URL.createObjectURL(imageFile),
//             });
//           },
//           "image/jpeg",
//           1
//         );
//         setinvalidImage(null);
//       };
//       img.onerror = () => {
//         setinvalidImage("Invalid image content.");
//         return false;
//       };
//       //debugger
//       img.src = e.target.result;
//     };
//     reader.readAsDataURL(imageFile);
//   };
//   //========================= image resize close ==========================//

//   const handalShare = async () => {
//     try {
//       const data = new FormData();
//       //data.append("file", image);
//       data.append("file", userInfo.file);
//       data.append("upload_preset", "myintrest");
//       data.append("cloud_name", "myinstrestcloud");

//       if (!title || !pic) {
//         if (!title) {
//           alert("fill the title");
//         } else {
//           alert("fill the image");
//         }
//       } else {
//         if (loading === false) {
//           setLoading(true);
//         } else {
//           setLoading(false);
//         }
//         const res = await axios.post(
//           "https://api.cloudinary.com/v1_1/myinstrestcloud/image/upload",
//           data
//         );
//         setUrl(res.data.url);
//       }
//     } catch (error) {
//       console.log(error);
//       alert(error.response.data.message);
//     }
//   };

//   const postFeatch = async () => {
//     if (url) {
//       try {
//         const resPost = await axios.post(
//           "http://localhost:8000/post/createpost",
//           { title, pic: url },
//           config
//         );
//         console.log(resPost);
//         alert("successfull");
//         nav("/");
//       } catch (error) {
//         console.log(error);
//         alert("faled");
//       }
//     }
//   };
//   useEffect(() => {
//     postFeatch();
//     console.log(url);

//     if (!token) {
//       nav("/login");
//     }
//   }, [url]);

//   return (
//     <>
//       <div className="conatiner">
//         <div className="col-lg-4 col-md-6 m-auto">
//           {!loading ? (
//             <>
//               <div className="section__title">
//                 <h3>Create New Post </h3>
//                 <button onClick={handalShare} className="btn button">
//                   Share
//                 </button>
//               </div>
//               <div>
//                 {invalidImage !== null ? (
//                   <p className="form-error"> {invalidImage} </p>
//                 ) : null}
//                 <div>
//                   <input
//                     type="file"
//                     className="form-control"
//                     name="upload_file"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <figure>
//                   <img
//                     className="w-100"
//                     src={
//                       userInfo.filepreview === null
//                         ? "/images/uplodeImg.jpg"
//                         : userInfo.filepreview
//                     }
//                     alt="UploadImage"
//                   />
//                 </figure>
//               </div>
//               <div className="userInfo">
//                 <div className="createPostUser">
//                   <img
//                     className="userImg"
//                     src={
//                       user.Photo
//                         ? user.Photo
//                         : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=826&t=st=1689934495~exp=1689935095~hmac=71350deb4cde0675b1953db745e3b8a0d989993f5f9eee39a80815ceb22ffbf9"
//                     }
//                   />
//                 </div>
//                 <h4>{user.userName}</h4>
//                 <textarea
//                   rows={2}
//                   onChange={(e) => {
//                     setTitle(e.target.value);
//                   }}
//                   placeholder="Write a caption....."
//                 ></textarea>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="loadingTop">
//                 <div className="loading"></div>
//                 <p className="fs-5">Loading...</p>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Createpost;

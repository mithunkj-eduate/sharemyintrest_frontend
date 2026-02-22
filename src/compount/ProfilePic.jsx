import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState, useRef } from "react";
import Post from "../screens/Post";
import { BASEURL } from "../config/config";
import { SafeImage } from "./helper/SafImage";

function ProfilePic({ data }) {
  const { user, changeProfilePhoto, setUrl } = data;
  const [lgShow, setLgShow] = useState(false);
  const [image, setImage] = useState();

  //========================= image resize ==========================//

  const [invalidImage, setinvalidImage] = useState(null);
  let reader = new FileReader();
  const handleInputChange = (event) => {
    const imageFile = event.target.files[0];
    const imageFilname = event.target.files[0].name;

    if (!imageFile) {
      setinvalidImage("Please select image.");
      return false;
    }

    if (!imageFile.name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
      setinvalidImage("Please select valid image JPG,JPEG,PNG");
      return false;
    }
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        //------------- Resize img code ------------------------//
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 300;
        var MAX_HEIGHT = 300;
        var width = img.width;
        var height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob(
          (blob) => {
            const file = new File([blob], imageFilname, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            setImage(file);
          },
          "image/jpeg",
          1
        );
        setinvalidImage(null);
      };
      img.onerror = () => {
        setinvalidImage("Invalid image content.");
        return false;
      };
      //debugger
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  };
  //========================= image resize close ==========================//

  // const handalShare = async () => {
  //   const data = new FormData();
  //   data.append("file", image);
  //   data.append("upload_preset", "myintrest");
  //   data.append("cloud_name", "myinstrestcloud");

  //   const res = await intercepter.post(
  //     "https://api.cloudinary.com/v1_1/myinstrestcloud/image/upload",
  //     data
  //   );
  //   console.log(res);
  //   setUrl(res.data.url);
  // };

  const hiddenFileInput = useRef(null);
  const handalClick = () => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (image) {
      setUrl(image);

      setImage("");
    }
  }, [image]);

  return (
    <>
      <div className="userImgTop">
       <SafeImage
          alt=""
          onClick={() => setLgShow(true)}
          src={user.Photo ? `${BASEURL}${user.Photo}` : "/images/user.png"}
          className="innerImg"
        />
      </div>

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Change Profile Photo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <div>
              <button
                onClick={handalClick}
                className="btn w-100 btn-light mb-2"
              >
                Uplode Profile
              </button>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleInputChange}
                accept="image/*"
                className="form-control"
                style={{ display: "none" }}
              />
            </div>

            {/* <button
              onClick={() => {
                setUrl("");
                changeProfilePhoto();
              }}
              className="btn text-danger btn-light w-100 mb-2"
            >
              Remove Current Photo
            </button> */}
            <Post pageType={"Modal"}/>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProfilePic;

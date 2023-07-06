import React, { useEffect, useRef, useState } from "react";
import { message } from "antd";

import profileImg from "./profileImg.png";

import { UserService } from "../../../services/User";

import classes from "./ProfilePicForm.module.css";

export default function ProfilePicForm() {
  const [imgInput, setImgInput] = useState(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fileExtension, setFileExtension] = useState(null);
  const [imgData, setImgData] = useState(null);

  const inputEl = useRef();

  const handleImageChange = (e) => {
    //const file = e.target.file[0]
    const file = e;
    const extension = file.type.split("/")[1];
    setFileExtension(extension);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      //convert image to binary string
      const imageData = new Uint8Array(reader.result);
      //convert binary string to Base64-encoded ASCII string
      //errorConverting array buffer to string - Maximum call stack size exceeded
      //const imageBase64 = btoa(String.fromCharCode(...imageData))
      const imageBase64 = btoa(
        imageData.reduce(function (data, byte) {
          return data + String.fromCharCode(byte);
        }, "")
      );
      setImgData(imageBase64);
    };
  };

  const handleClickConsoleLog = async () => {
    console.log(fileExtension);
    console.log(imgData);
  };

  const sendData = () => {
    try {
      setDisabledInput(true);
      setLoading(true);
      // fetch('https://asia-southeast1-clevermath-official.cloudfunctions.net/v3-utility-uploadProfileImage', {
      //   method: 'POST',
      //   mode: 'cors',
      //   body: JSON.stringify({ data: { image: imgData, fileExtension: fileExtension}}),
      //   //body: { data: { image: imgData, fileExtension: fileExtension}},
      //   headers:{ 'Content-Type': 'application/json',}
      // })
      UserService.uploadProfileImageAsync({
        image: imgData,
        fileExtension: fileExtension,
      }).then((res) => {
        console.log(res);
        setDisabledInput(false);
      });
      //)
      message.success("บันทึกรูปโปรไฟล์เรียบร้อย", 3);
    } catch (err) {
      message.error("พบข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", 3);
      console.error(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div>
          <img
            src={imgInput ? URL.createObjectURL(imgInput) : profileImg}
            width="200"
            height="200"
            alt="user"
            role="button"
            onClick={() => inputEl.current.click()}
          />
          <input
            disabled={disabledInput ? true : false}
            type="file"
            ref={inputEl}
            accept="image/*"
            onChange={(e) => {
              if (e.target.files[0]) setImgInput(e.target.files[0]);
              if (e.target.files[0]) handleImageChange(e.target.files[0]);
            }}
          />
          <button
            type="button"
            onClick={() => setImgInput(null)}
            className={classes.editProfilePicButton}
          >
            ยกเลิก
          </button>
          {/* <div
            onClick={handleClickConsoleLog}
          >
            console.log
          </div> */}
          <div>
            <button
              onClick={sendData}
              className={classes.editProfilePicButton}
              disabled={disabledInput ? true : false}
            >
              เลือกรูปภาพ
            </button>
          </div>
        </div>
        <div>
          <br />
        </div>
      </div>
    </>
  );
}

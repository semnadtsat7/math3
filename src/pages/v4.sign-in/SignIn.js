import React, { useState } from "react";

import styled from "styled-components";
import firebase from "firebase/app";

import { Rule } from "@cesium133/forgjs";
import { Modal, message } from "antd";

import Email from "./Input.Email";
import Password from "./Input.Password";
import Submit from "./Submit";
import Forget from "./Forgot";

import http from "../../utils/FirebaseCloud";

// import Footer from './Footer';

const Form = styled.form`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;
`;

const Texts = {
  signing: "กำลังเข้าสู่ระบบ",
  sending: "กำลังส่งคำขอตั้งค่ารหัสผ่านใหม่",
};

function Page({ onSignUpClick }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgot, setForgot] = useState(false);

  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    await new Promise((r) => setTimeout(r, 100));

    const emailRule = new Rule({
      type: "email",
      notEmpty: true,
    });

    const passwordRule = new Rule({
      type: "password",
      minLength: 6,
      maxLength: 32,
    });

    const errors = [];

    const isEmailValid = emailRule.test(email);
    const isPasswordValid = passwordRule.test(password);

    if (!isEmailValid) {
      errors.push("email");
    }

    if (!isPasswordValid) {
      errors.push("password");
      // setForgot (true)
    }

    if (errors.length > 0) {
      setErrors(errors);
      setStatus("error");

      return;
    }

    setErrors([]);
    setStatus("signing");

    // http
    //   .signInAsync(email, password)
    //   .then((res) => doSignIn(res))
    //   .catch((err) => {
    //     console.log(err);
    //     // errors handlers
    //     errors.push("email");
    //     errors.push("password");

    //     setForgot(true);
    //     setErrors(errors);
    //     setStatus("error");

    //     message.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    //   });

    const auth = firebase.auth();
    const callback = () => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          window.localStorage.removeItem("space");
          window.localStorage.removeItem("spaces");
          window.localStorage.removeItem("local_id");

          auth.currentUser.getIdToken().then((token) => {
            // Do Nothing . . .
          });
        })
        .catch((err) => {
          errors.push("email");
          errors.push("password");

          setForgot(true);
          setErrors(errors);
          setStatus("error");

          message.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        });
    };

    auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(callback)
      .catch((err) => {
        errors.push("email");
        errors.push("password");

        setForgot(true);
        setErrors(errors);
        setStatus("error");

        message.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      });
  }

  function handleForgotPassword() {
    const m = Modal.confirm({
      centered: true,
      icon: null,

      title: "ส่งคำขอตั้งค่ารหัสผ่านใหม่ ?",
      content: "ระบบจะทำการส่งคำขอตั้งค่ารหัสผ่านไปยังอีเมลที่ระบุ",
      cancelText: "ยกเลิก",
      okText: "ส่ง",
      onOk: () => {
        handleSendResetPassword();
        m.destroy();
      },
    });
  }

  async function handleSendResetPassword() {
    const emailRule = new Rule({
      type: "email",
      notEmpty: true,
    });

    const errors = [];

    const isEmailValid = emailRule.test(email);

    if (!isEmailValid) {
      errors.push("email");

      setErrors(errors);
      setStatus("error");

      message.error("อีเมลไม่ถูกต้อง");

      return;
    }

    setErrors([]);
    setStatus("sending");

    const auth = firebase.auth();

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setStatus(false);

        message.success(
          "ส่งคำขอตั้งค่ารหัสผ่านใหม่ไปยังอีเมลที่ระบุเรียบร้อยแล้ว"
        );
      })
      .catch((err) => {
        errors.push("email");

        setErrors(errors);
        setStatus("error");

        message.error("อีเมลไม่ถูกต้อง");
      });
  }

  const signing = status === "signing";
  const sending = status === "sending";
  const error = status === "error";

  const loading = signing || sending;

  return (
    <Form onSubmit={handleSubmit}>
      <Email
        defaultValue={email}
        onChange={setEmail}
        error={error && errors.indexOf("email") >= 0}
        disabled={loading}
      />
      <Password
        defaultValue={password}
        onChange={setPassword}
        error={error && errors.indexOf("password") >= 0}
        disabled={loading}
      />
      <Submit
        // error={error}
        text="เข้าสู่ระบบ"
        loading={loading}
        loadingText={Texts[status]}
      />
      <Forget
        loading={loading}
        disabled={!forgot}
        onClick={handleForgotPassword}
      />
      {/* <Footer 
                loading={loading}
                onClick={onSignUpClick}
            /> */}
    </Form>
  );
}

export default Page;

import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Alert, Card, Spinner } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [count, setCount] = useState(60);
  let counter = 60;
  let interval = "";

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({
    isShow: false,
    message: "",
    isError: false,
  });

  const onChangeHanlder = (e) => {
    const { value } = e.target;
    setEmail(value);
  };
  const countDown = () => {
    setCount((prevState) => prevState - 1);
    counter -= 1;
    if (counter <= 0) {
      console.log("oso", counter);
      clearInterval(interval);
      setIsButtonClicked(false);
      counter = 60;
      setCount(60);
    }
  };
  const timer = () => {
    if (count > 0) {
      interval = setInterval(countDown, 1000);
    }
  };
  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    if (isButtonClicked) return;
    try {
      setIsButtonClicked(true);
      const response = await axios.post(
        "http://localhost:5000/user/forgot-password",
        { email }
      );
      setMessage({
        isShow: true,
        isError: false,
        message: response.data.message,
      });
      setCount((prevState) => prevState - 1);
      timer();
    } catch (error) {
      setIsButtonClicked(false);

      if (error.name == "AxiosError") {
        setMessage({
          isError: true,
          isShow: true,
          message: error.response?.data?.message,
        });
      } else {
        setMessage({ isShow: true, isError: true, message: error.message });
      }
    }
  };
  console.log("login rendred");
  return (
    <>
      <Card
        bg="success"
        border="primary"
        text="white"
        className=" mx-auto"
        style={{ width: "28rem", marginTop: "100px" }}
      >
        <Card.Header>
          <h3>Forgot Password</h3>
        </Card.Header>
        <Card.Body>
          <Form method="post">
            {message.isShow && (
              <Alert
                variant={message.isError ? "danger" : "success"}
                onClose={() => setMessage({ ...message, isShow: false })}
                dismissible
              >
                {message.message}
              </Alert>
            )}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={onChangeHanlder}
              />
            </Form.Group>

            <Button
              disabled={isButtonClicked}
              variant="dark"
              type="submit"
              className="w-100 btn-block"
              onClick={(e) => {
                forgotPasswordHandler(e);
              }}
            >
               {count <= 59 && count > -1 ? <> Resend in {count} </> : "Forgot Password"}
              {isButtonClicked && count > 59 && (
                <Spinner animation="border" size="sm" variant="primary" role="status" style={{marginLeft:"10px"}}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

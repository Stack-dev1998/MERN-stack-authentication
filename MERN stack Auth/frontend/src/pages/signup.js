import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert, Card } from "react-bootstrap";

export default function Signup() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [signupModal, setSignupModal] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    isError: false,
    isShow: false,
    message: "",
  });
  let navigate = useNavigate();
  const onChangeHanlder = (e) => {
    const { name, value } = e.target;
    setSignupModal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    if (isButtonClicked) return;

    try {
      setIsButtonClicked(true);
      const { name, email, password, confirmPassword } = signupModal;
      if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
      )
        throw new Error("Please fill all fields");
      if (password !== confirmPassword) {
        throw new Error("Passwords not matched!");
      }
      const res = await axios.post(
        "http://localhost:5000/user/signup",
        signupModal
      );
      console.log(res, "ssss");
      setErrorMessage({
        isShow: true,
        isError: false,
        message: res.data.message,
      });
      // navigate("/login", { replace: true });
      // setIsButtonClicked(false);
    } catch (error) {
      setIsButtonClicked(false);
      if (error.name == "AxiosError") {
        setErrorMessage({
          isShow: true,
          isError: true,
          message: error.response?.data?.message,
        });
      } else {
        setErrorMessage({
          isShow: true,
          isError: true,
          message: error.message,
        });
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
        style={{ width: "24rem", marginTop: "100px" }}
      >
        <Card.Header>
          <h3>Signup</h3>
        </Card.Header>
        <Card.Body>
          <Form method="post">
            {errorMessage.isShow && (
              <Alert
                variant={errorMessage.isError ? "danger" : "success"}
                onClose={() =>
                  setErrorMessage({ ...errorMessage, isShow: false })
                }
                dismissible
              >
                {errorMessage.message}
              </Alert>
            )}
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                name="name"
                onChange={onChangeHanlder}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={onChangeHanlder}
              />
            </Form.Group>

            <Form.Group className="mb-0 " controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={onChangeHanlder}
              />
            </Form.Group>
            <Form.Group className="mb-0 " controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                onChange={onChangeHanlder}
              />
            </Form.Group>

            <Card.Text
              role="button"
              className="mb-3 text-end"
              onClick={() => navigate("/login", { replace: true })}
            >
              Already have account?
            </Card.Text>
            <Button
              disabled={isButtonClicked}
              variant="dark"
              type="submit"
              className="w-100 btn-block"
              onClick={(e) => {
                signupHandler(e);
              }}
            >
              Signup
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert, Card } from "react-bootstrap";
import MyContext from "../components/MyContext";

export default function Login() {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [loginModal, setLoginModal] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState({
    isError: false,
    message: "",
  });
  let navigate = useNavigate();
  const onChangeHanlder = (e) => {
    const { name, value } = e.target;
    setLoginModal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginHandler = async (e, data) => {
    e.preventDefault();
    if(isButtonClicked) return
    try {
      setIsButtonClicked(true)
      const { email, password } = loginModal;
      if (email === "" || password === "")
        throw new Error("Please fill all fields");
      await axios.post("http://localhost:5000/user/login", loginModal);
      data.logInHandler();
      navigate("/user/dashboard", { replace: true });
      setIsButtonClicked(false)

    } catch (error) {
      setIsButtonClicked(false)
    
      if (error.name == "AxiosError") {
        setErrorMessage({
          isError: true,
          message: error.response?.data?.message,
        });
      } else {
        setErrorMessage({ isError: true, message: error.message });
      }
    }
  };
  console.log("login rendred");
  return (
    <MyContext.Consumer>
      {(context) => (
        <Card
          bg="success"
          border="primary"
          text="white"
          className=" mx-auto"
          style={{ width: "24rem", marginTop: "100px" }}
        >
          <Card.Header>
            <h3>Login</h3>
          </Card.Header>
          <Card.Body>
            <Form method="post">
              {errorMessage.isError && (
                <Alert
                  variant={"danger"}
                  onClose={() =>
                    setErrorMessage({ ...errorMessage, isError: false })
                  }
                  dismissible
                >
                  {errorMessage.message}
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

              <Form.Group className="mb-0 " controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={onChangeHanlder}
                />
              </Form.Group>
              <Card.Text
                role="button"
                className="mb-3 text-end"
                onClick={() => navigate("/forgot-password", { replace: true })}
              >
                Forgotten password?
              </Card.Text>
              <Button
              disabled={isButtonClicked}
                variant="dark"
                type="submit"
                className="w-100 btn-block"
                onClick={(e) => {
                  loginHandler(e, context);
                }}
              >
                Login
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="w-100 btn-block mt-3"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Create Account
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </MyContext.Consumer>
  );
}

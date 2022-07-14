import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import PrivateLayout from "./components/privateLayout";
import PublicLayout from "./components/publicLayout";
import MyProvider from "./components/MyProvider";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("App rendred", isLoggedIn);
  return (
    <MyProvider setIsLoggedIn={setIsLoggedIn}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route path={"/login"} exact name={"login"} element={<Login />} />
            <Route
              path={"/signup"}
              exact
              name={"signup"}
              element={<Signup />}
            />
            <Route
              path={"/forgot-password"}
              exact
              name={"forgot password"}
              element={<ForgotPassword />}
            />
          </Route>

          {isLoggedIn && (
            <Route element={<PrivateLayout />}>
              <Route
                path={"/dashboard"}
                exact
                name={"dashbaord"}
                element={<Dashboard />}
              />
            </Route>
          )}

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
}

export default App;

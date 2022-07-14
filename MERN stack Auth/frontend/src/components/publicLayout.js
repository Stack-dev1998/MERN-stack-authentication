import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button, Form, Alert, Nav } from "react-bootstrap";

export default function Layout() {
  const activeStyle = { color: "white", backgroundColor: "black" };
  let location = useLocation();

  return (
    <div className="h-full">
      <Nav
        className="mt-2  justify-content-end"
        variant="tabs"
        defaultActiveKey="login"
      >
        <Nav.Item>
          <Nav.Link
            as={Link}
            to={"/login"}
            className="me-4"
            style={location.pathname === "/login" ? activeStyle : {}}
          >
            Login
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to={"/signup"}
            className="me-4"
            style={location.pathname === "/signup" ? activeStyle : {}}
          >
            Signup
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Outlet />
    </div>
  );
}

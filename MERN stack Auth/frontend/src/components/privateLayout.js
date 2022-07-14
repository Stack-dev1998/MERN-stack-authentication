import React from "react";
import { Outlet } from "react-router-dom";
import MyContext from "./MyContext";

export default function Layout() {
  return (
    <MyContext.Consumer>
      {(context) => (
        <>
          <div className="p-4 border-bottom" >
            <p
              role="button"
              style={{ float: "right", fontWeight: "bold",  }}
              onClick={() => {
                context.logOutHandler();
              }}
            >
              {" "}
              LogOut{" "}
            </p>
          </div>

          <div>
            <Outlet />
          </div>
        </>
      )}
    </MyContext.Consumer>
  );
}

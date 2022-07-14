import React ,{useState} from "react";
import MyContext from "./MyContext";
export default function MyProvider(props) {

  return (
    <MyContext.Provider
      value={{
        logInHandler: () => {
          props.setIsLoggedIn(true)
        },
        logOutHandler: () => {
         props.setIsLoggedIn(false)
        },
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
}

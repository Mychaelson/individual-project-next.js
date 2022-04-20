import user_types from "../redux/reducers/user/types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axiosInstance from "../config/api";

// authProvider is an component that return the component or a page as a children after a process has been executed
// for this case, the process is to keep the user logged in, if there is a cookie in the browser which is usually used when the user refresh the page
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const authSelector = useSelector((state) => state.user);

  // the useEffect will trigger the process of getting the token
  useEffect(async () => {
    const auth_token = Cookies.get("auth_token");

    // if the token exist, it will be send to backend and recevie a new token and set in the cookie
    // it will also recieve the user data which then dispatch to the global state (redux)
    if (auth_token) {
      try {
        const userResponse = await axiosInstance.get("/auth/refresh-token");

        Cookies.set("auth_token", userResponse?.data?.result?.token || "");

        const userLogin = userResponse.data.result.User;

        dispatch({
          type: user_types.LOGIN_USER,
          payload: {
            username: userLogin.username,
            full_name: userLogin.full_name,
            email: userLogin.email,
            id: userLogin.id,
            bio: userLogin.bio,
            avatar_url: userLogin.avatar_img,
            is_verify: userLogin.is_verified,
          },
        });
      } catch (err) {
        console.log(err);
        // toast({
        //   title: "relogin failed",
        //   description: "Username or password is invalid",
        //   status: "error",
        //   duration: 3000,
        //   isClosable: true,
        //   position: "top",
        // });
      }
    }
  }, []);
  return children;
};

export default AuthProvider;

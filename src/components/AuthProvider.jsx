import {} from "react-redux";
import user_types from "../redux/reducers/user/types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axiosInstance from "../config/api";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const authSelector = useSelector((state) => state.user);

  useEffect(async () => {
    const auth_token = Cookies.get("auth_token");

    if (auth_token) {
      try {
        const userResponse = await axiosInstance.get("/auth/refresh-token");

        Cookies.set("auth_token", userResponse?.data?.result?.token || "");

        const userLogin = userResponse.data.result.user;

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

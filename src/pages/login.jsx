import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import LoginImg from "../components/loginImage";
import LoginForm from "../components/LoginForm";
import guestOnly from "../config/guestOnly";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const Login = () => {
  const authSelector = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (authSelector.id) {
      router.push("/home-page");
    }
  }, [authSelector.id]);

  return (
    <Box display="flex" width="100%">
      <LoginImg />
      <LoginForm />
    </Box>
  );
};

export default Login;

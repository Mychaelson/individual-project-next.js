import React, { useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Box } from "@chakra-ui/react";
import LoginImg from "../components/loginImage";
import WelcomeData from "../components/WelcomeData";
import guestOnly from "../config/guestOnly";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const authSelector = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    // redirect to home-page if the redux has been filled
    // prteection so that the user that have loggedin cant access this page
    if (authSelector.id) {
      router.push("/home-page");
    }
  }, []);

  return (
    <Box display="flex" width="100%">
      <LoginImg />
      <WelcomeData />
    </Box>
  );
};

export default RegisterPage;

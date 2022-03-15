import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Box } from "@chakra-ui/react";
import LoginImg from "../components/loginImage";
import WelcomeData from "../components/WelcomeData";
import guestOnly from "../config/guestOnly";

const RegisterPage = () => {
  return (
    <Box display="flex" width="100%">
      <LoginImg />
      <WelcomeData />
    </Box>
  );
};

export const getServerSideProps = guestOnly((context) => {
  return {
    props: {},
  };
});

export default RegisterPage;

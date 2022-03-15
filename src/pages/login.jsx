import React from "react";
import { Box } from "@chakra-ui/react";
import LoginImg from "../components/loginImage";
import LoginForm from "../components/LoginForm";
import guestOnly from "../config/guestOnly";

const Login = () => {
  return (
    <Box display="flex" width="100%">
      <LoginImg />
      <LoginForm />
    </Box>
  );
};

export const getServerSideProps = guestOnly((context) => {
  return {
    props: {},
  };
});

export default Login;

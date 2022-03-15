import React from "react";
import RegisterForm from "../components/register";
import { Box } from "@chakra-ui/react";
import LoginImg from "../components/loginImage";

const Register = () => {
  return (
    <Box display="flex" width="100%">
      <LoginImg />
      <RegisterForm />
    </Box>
  );
};

export default Register;

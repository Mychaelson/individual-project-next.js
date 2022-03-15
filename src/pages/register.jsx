import React from "react";
import RegisterForm from "../components/register";
import { Box } from "@chakra-ui/react";
import LoginImg from "../components/loginImage";
import guestOnly from "../config/guestOnly";

const Register = () => {
  return (
    <Box display="flex" width="100%">
      <LoginImg />
      <RegisterForm />
    </Box>
  );
};

export const getServerSideProps = guestOnly((context) => {
  return {
    props: {},
  };
});

export default Register;

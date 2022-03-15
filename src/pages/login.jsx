import React from "react";
import { Box } from "@chakra-ui/react";
import LoginImg from "../components/loginImage";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <Box display="flex" width="100%">
      <LoginImg />
      <LoginForm />
    </Box>
  );
};

export const getServerSideProps = async (context) => {
  const savedUserData = context.req.cookies.user_data;
  console.log(savedUserData);
  if (savedUserData) {
    return {
      redirect: {
        destination: "/home-page",
      },
    };
  }

  return {
    props: {},
  };
};

export default Login;

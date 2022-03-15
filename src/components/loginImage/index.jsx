import React from "react";
import { Box, Image } from "@chakra-ui/react";

const LoginImg = () => {
  return (
    <Box height="100vh" width="50%">
      <Image
        width="100%"
        height="100vh"
        objectFit="cover"
        src="https://images.pexels.com/photos/3585089/pexels-photo-3585089.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        alt="Login img"
      />
    </Box>
  );
};

export default LoginImg;

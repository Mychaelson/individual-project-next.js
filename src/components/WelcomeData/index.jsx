import React from "react";
import { Box, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";

const WelcomeData = () => {
  return (
    <Box
      height="100vh"
      width="50%"
      display="flex"
      justifyContent="center"
      flexDir={"column"}
      ps="10"
      paddingEnd="10"
    >
      <Heading size="lg">Welcome To SmileGram</Heading>
      <Box mt={3}>
        <Link href="/login">
          <Button color="black" borderColor="blue" border="2px" marginRight={2}>
            Sign in
          </Button>
        </Link>
        <Link href="/register">
          <Button colorScheme="teal">Register</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default WelcomeData;

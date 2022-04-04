import React from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  Icon,
  Link as UILink,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import axiosInstance from "../../config/api";
import { useDispatch, useSelector } from "react-redux";
import user_types from "../../redux/reducers/user/types";
import Link from "next/link";
import Navbar from "../navbar";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const LoginForm = () => {
  const [show, setShow] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const router = useRouter();

  const toast = useToast();

  const showPass = () => {
    setShow(!show);
  };

  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);

  const inputHandler = (event, field) => {
    const { value } = event.target;
    if (field === "username") {
      setUsernameInput(value);
    } else if (field === "password") {
      setPasswordInput(value);
    }
  };

  const loginButtonHandler = async () => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        username: usernameInput,
        password: passwordInput,
      });

      const userLogin = res.data.result.findUser;

      dispatch({
        type: user_types.LOGIN_USER,
        payload: {
          username: userLogin.username,
          full_name: userLogin.full_name,
          email: userLogin.email,
          id: userLogin.id,
          bio: userLogin.bio,
          avatar_url: userLogin.avatar_url,
        },
      });

      Cookies.set("auth_token", res.data.result.token);

      router.push("/home-page");
    } catch (err) {
      console.log(err.response);
      toast({
        title: "login failed",
        description: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Box
        height="100vh"
        width="50%"
        display="flex"
        justifyContent="center"
        flexDir={"column"}
        ps="10"
        paddingEnd="10"
      >
        <Heading size="lg">Sign in to your account</Heading>
        <Box mt={5}>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              onChange={(e) => {
                inputHandler(e, "username");
              }}
              id="username"
              type="text"
            />
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                onChange={(e) => {
                  inputHandler(e, "password");
                }}
                id="password"
                type={show ? "text" : "password"}
              />
              <InputRightElement>
                <Icon
                  as={show ? AiOutlineEyeInvisible : AiOutlineEye}
                  onClick={() => showPass()}
                  className="click"
                />
              </InputRightElement>
            </InputGroup>
            <FormHelperText>We'll never share your data.</FormHelperText>
          </FormControl>
        </Box>
        <Text mt={1} fontSize="smaller" color="#3b5cd4">
          <UILink>Forgot Password?</UILink>
        </Text>
        <Link href="/register">
          <Text mt={1} fontSize="smaller" color="#3b5cd4">
            <UILink>Have not register?</UILink>
          </Text>
        </Link>
        <Button onClick={loginButtonHandler} mt={5} colorScheme="teal">
          Sign in
        </Button>
      </Box>
    </>
  );
};

export default LoginForm;

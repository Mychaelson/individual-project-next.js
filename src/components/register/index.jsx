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
  Tooltip,
  Link as UILink,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai";
// import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../config/api";
import Link from "next/link";
import { useRouter } from "next/router";

const RegisterForm = () => {
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const router = useRouter();
  const Toast = useToast();

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const showPasswordConfirm = () => {
    setShowPassConfirm(!showPassConfirm);
  };

  const userSelector = useSelector((state) => state.user);

  const { setFieldValue, handleSubmit, errors, touched, isSubmitting } =
    useFormik({
      initialValues: {
        full_name: "",
        email: "",
        user_name: "",
        password: "",
        confirmPassword: "",
      },
      onSubmit: async (values) => {
        try {
          const newUser = {
            username: values.user_name,
            full_name: values.full_name,
            email: values.email,
            password: values.password,
          };

          const createNewUser = await axiosInstance.post(
            "/auth/register",
            newUser
          );

          Toast({
            title: "Register Successful!",
            description: createNewUser.data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          router.push("/login");
        } catch (error) {
          console.log(error.response.data.message);
          Toast({
            title: "Register Failed!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      },
      validationSchema: Yup.object().shape({
        // TODO: add regex in the password
        full_name: Yup.string()
          .required("Full name is required")
          .min(3, "Full name must be at least 3 characters")
          .max(25, "Username must not exceed 25 characters"),
        email: Yup.string()
          .required("Email is required")
          .email("Email is invalid"),
        user_name: Yup.string()
          .required("Username is required")
          .min(3, "Username must be at least 3 characters")
          .max(20, "Username must not exceed 20 characters"),
        password: Yup.string()
          .required("Password is required")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
          ),
        confirmPassword: Yup.string()
          .required("Confirm Password is required")
          .oneOf(
            [Yup.ref("password"), null],
            "Confirm Password does not match"
          ),
      }),
      validateOnChange: false,
    });

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
      <Heading size="lg">Register your new account</Heading>
      <Box mt={5}>
        <FormControl isRequired isInvalid={errors.full_name}>
          <FormLabel htmlFor="fullName" mt={2}>
            Full Name
          </FormLabel>
          <Input
            id="fullName"
            type="text"
            placeholder="Hello World"
            onChange={(e) => setFieldValue("full_name", e.target.value)}
          />
          {errors.full_name && touched.full_name && (
            <FormErrorMessage>{errors.full_name}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={errors.user_name}>
          <FormLabel htmlFor="username" mt={2}>
            Username
          </FormLabel>
          <Input
            id="username"
            type="text"
            placeholder="HelloWorld22"
            onChange={(e) => setFieldValue("user_name", e.target.value)}
          />
          {errors.user_name && touched.user_name && (
            <FormErrorMessage>{errors.user_name}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={errors.email}>
          <FormLabel htmlFor="email">Email address</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="helloWorld@mail.com"
            onChange={(e) => setFieldValue("email", e.target.value)}
          />
          {errors.email && touched.email && (
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={errors.password}>
          <FormLabel htmlFor="password" mt={2}>
            Password
            <Tooltip
              label="Passwords should contain at least 8 characters including an uppercase letter, a symbol, and a number"
              fontSize="sm"
            >
              <span>
                <Icon ms={1} as={AiOutlineInfoCircle} />
              </span>
            </Tooltip>
          </FormLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setFieldValue("password", e.target.value)}
            />
            <InputRightElement>
              <Icon
                as={showPass ? AiOutlineEyeInvisible : AiOutlineEye}
                onClick={() => showPassword()}
                className="click"
              />
            </InputRightElement>
          </InputGroup>
          {errors.password && touched.password && (
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={errors.confirmPassword}>
          <FormLabel htmlFor="confirmPassword" mt={2}>
            Password
            <Tooltip
              label="Passwords should contain at least 8 characters including an uppercase letter, a symbol, and a number"
              fontSize="sm"
            >
              <span>
                <Icon ms={1} as={AiOutlineInfoCircle} />
              </span>
            </Tooltip>
          </FormLabel>
          <InputGroup>
            <Input
              id="confirmPassword"
              type={showPassConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
            />
            <InputRightElement>
              <Icon
                as={showPassConfirm ? AiOutlineEyeInvisible : AiOutlineEye}
                onClick={() => showPasswordConfirm()}
                className="click"
              />
            </InputRightElement>
          </InputGroup>
          {errors.confirmPassword && touched.confirmPassword && (
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          )}
        </FormControl>
      </Box>
      <Text mt={1} color="#3b5cd4" fontSize="smaller">
        <Link href="/login">
          <UILink>Already have an account?</UILink>
        </Link>
      </Text>
      <Button
        mt={5}
        colorScheme="teal"
        onClick={() => {
          handleSubmit();
        }}
        disabled={isSubmitting}
      >
        Sign in
      </Button>
    </Box>
  );
};

export default RegisterForm;

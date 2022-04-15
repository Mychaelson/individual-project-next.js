import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import * as Yup from "yup";
import axiosInstance from "../config/api";

const resetPassword = () => {
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const showPassword = () => {
    setShowPass(!showPass);
  };

  const showPasswordConfirm = () => {
    setShowPassConfirm(!showPassConfirm);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
      confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
    }),
    onSubmit: async (values) => {
      try {
        const newPassword = {
          password: values.password,
          forgotPasswordToken: router.query.fp_token,
        };

        await axiosInstance.patch("/auth/change-password-forgot", newPassword);

        toast({
          title: "Password has been reset",
          description:
            "You can now login to your account using your new password",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        router.push("/login");
      } catch (err) {
        console.log(err.response.data.message);
        toast({
          title: "Failed reset password",
          description: err.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    },
    validateOnChange: false,
  });

  return (
    <Flex align="center" justify="center" height="calc(100vh - 70px)">
      <Box
        rounded={"xl"}
        boxShadow={"lg"}
        width="500px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Text fontSize="3xl" fontWeight="bold">
          Reset Password
        </Text>
        <FormControl isRequired isInvalid={formik.errors.password}>
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
              onChange={(e) => formik.setFieldValue("password", e.target.value)}
            />
            <InputRightElement>
              <Icon
                as={showPass ? AiOutlineEyeInvisible : AiOutlineEye}
                onClick={() => showPassword()}
                className="click"
              />
            </InputRightElement>
          </InputGroup>
          {formik.errors.password && formik.touched.password && (
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={formik.errors.confirmPassword}>
          <FormLabel htmlFor="confirmPassword" mt={2}>
            Confirm Password
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
              onChange={(e) =>
                formik.setFieldValue("confirmPassword", e.target.value)
              }
            />
            <InputRightElement>
              <Icon
                as={showPassConfirm ? AiOutlineEyeInvisible : AiOutlineEye}
                onClick={() => showPasswordConfirm()}
                className="click"
              />
            </InputRightElement>
          </InputGroup>
          {formik.errors.confirmPassword && formik.touched.confirmPassword && (
            <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          onClick={formik.handleSubmit}
          colorScheme="teal"
          mt={4}
          disabled={formik.isSubmitting}
        >
          Reset Password
        </Button>
      </Box>
    </Flex>
  );
};

export default resetPassword;

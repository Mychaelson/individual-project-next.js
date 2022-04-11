import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import EnterEmailOrUsername from "../components/enterEmailOrUsername";
import axiosInstance from "../config/api";

const forgotPasswordPage = () => {
  const toast = useToast();
  const router = useRouter();

  const submitButtonHandler = async (input) => {
    try {
      await axiosInstance.post("/auth/forgot-password", {
        email: input,
      });

      toast({
        title: "Email has been sent",
        description: "Please Check Your email to reset your password",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.log(err.response.data.message);
      toast({
        title: "Failed to Send Email",
        description: err.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <div>
      <EnterEmailOrUsername
        headers="Forgot Your Password?"
        info="We'll Send an email to reset your password"
        buttonText="Send Email"
        submitButtonHandler={submitButtonHandler}
      />
    </div>
  );
};

export default forgotPasswordPage;

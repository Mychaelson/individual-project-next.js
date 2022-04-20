import {
  Box,
  Button,
  calc,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";

const EnterEmailOrUsername = ({
  headers,
  info,
  buttonText,
  submitButtonHandler,
}) => {
  const [input, setInput] = useState(""); // this is where the input will be kept
  const [isSubmitting, setIsSubmitting] = useState(false); // this is the toggle to disabled the button when submmiting which is set manually

  // is the triggered when there is onchange on the input
  const inputHandler = (event) => {
    const { value } = event.target;
    setInput(value);
  };

  // the the input will be send after this fuction is called which is on button to send the input to backend
  const submitButton = async () => {
    setIsSubmitting(true);
    await submitButtonHandler(input);
    setIsSubmitting(false);
  };

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
          {headers}
        </Text>
        <Text fontSize="sm" mt={1}>
          {info}
        </Text>
        <FormControl>
          <Input
            onChange={(e) => inputHandler(e)}
            mt={4}
            placeholder="your-email@example.com"
          />
        </FormControl>
        <Button
          onClick={() => {
            submitButton();
          }}
          mt={4}
          colorScheme="teal"
          disabled={isSubmitting}
        >
          {buttonText}
        </Button>
      </Box>
    </Flex>
  );
};

export default EnterEmailOrUsername;

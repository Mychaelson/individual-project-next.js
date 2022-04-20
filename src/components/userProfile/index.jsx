import {
  Avatar,
  Box,
  Center,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Button,
  Textarea,
  useToast,
  Image,
  Stack,
  Badge,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEdit } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import axiosInstance from "../../config/api";
import { useEffect, useRef, useState } from "react";
import user_types from "../../redux/reducers/user/types";

const UserProfile = (props) => {
  const userSelector = useSelector((state) => state.user);
  const [imgUrlInput, setImgUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputFileRef = useRef(null);
  const Toast = useToast();
  const dispatch = useDispatch();

  // console.log(props.userData);

  const formik = useFormik({
    initialValues: {
      full_name: props.userData?.full_name ? props.userData?.full_name : "",
      username: props.userData?.username,
      bio: props.userData?.bio ? props.userData?.bio : "",
    },
    validationSchema: yup.object().shape({
      full_name: yup
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(25, "Username must not exceed 25 characters"),
      username: yup
        .string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must not exceed 20 characters"),
      bio: yup
        .string()
        .min(1, "bio must be at least 1 character")
        .max(150, "bio must not exceed 150 characters"),
    }),
    onSubmit: async (values) => {
      try {
        console.log("test", values.full_name);
        const formData = new FormData();

        formData.append("full_name", values.full_name);
        formData.append("bio", values.bio);
        values.username == userSelector.username
          ? undefined
          : formData.append("username", username);
        formData.append("avatar_image_file", selectedFile);

        await axiosInstance.patch(`/user/${userSelector.id}`, formData);
        setImgUrlInput("");
        setSelectedFile(null);

        const res = await axiosInstance.get("/user", {
          params: {
            user_id: userSelector.id,
          },
        });

        const userLogin = res.data.profile;
        // console.log(userLogin.avatar_img);

        dispatch({
          type: user_types.LOGIN_USER,
          payload: {
            username: userLogin.username,
            full_name: userLogin.full_name,
            email: userLogin.email,
            id: userLogin.id,
            bio: userLogin.bio,
            avatar_url: userLogin.avatar_img,
          },
        });

        onClose();

        // refreshPage();
      } catch (err) {
        console.log(err);
        Toast({
          title: "Fetch Data Failed",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    },
  });

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setImgUrlInput(event?.target?.files[0]?.name);
  };

  const resendVerificationButtonHandler = async () => {
    try {
      await axiosInstance.post("/auth/resend-verification");
      Toast({
        title: "Resend Verification Success",
        description: "Email has been sent",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.log(err);
      Toast({
        title: "Resend Verification Failed",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  formik.errors.full_name ? console.log(formik.errors.full_name) : undefined;
  formik.errors.bio ? console.log(formik.errors.bio) : undefined;
  formik.errors.username ? console.log(formik.errors.username) : undefined;

  return (
    // <Center>
    <Box justifyContent="start">
      <Box minWidth={700} display="flex" alignItems="center" mx={5}>
        <Avatar
          size="2xl"
          name="user"
          src={props.avatarUrl}
          marginX={8}
          my={4}
          boxShadow={"md"}
        />
        <Box>
          <Stack direction={"row"}>
            <Text fontWeight="bold" mb={0} fontSize="3xl">
              {props.username}{" "}
              {props.is_verify ? (
                <Badge colorScheme="green">verified</Badge>
              ) : (
                <Badge colorScheme="gray">not verified</Badge>
              )}
              {props.id === userSelector.id ? (
                <Icon
                  onClick={onOpen}
                  as={AiOutlineEdit}
                  boxSize={5}
                  className="click"
                />
              ) : null}
            </Text>
          </Stack>

          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay>
              <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel htmlFor="fullNameEdit">Full Name</FormLabel>
                    <Input
                      onChange={(e) => {
                        formik.setFieldValue("full_name", e.target.value);
                      }}
                      id="fullNameEdit"
                      type="text"
                      value={formik.values.full_name}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="usernameEdit">Username</FormLabel>
                    <Input
                      onChange={(e) => {
                        formik.setFieldValue("username", e.target.value);
                      }}
                      id="usernameEdit"
                      type="text"
                      value={formik.values.username}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="bioEdit">Bio</FormLabel>
                    <Textarea
                      onChange={(e) => {
                        formik.setFieldValue("bio", e.target.value);
                      }}
                      id="bioEdit"
                      type="text"
                      value={formik.values.bio}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="profilePictureEdit">
                      Profile Picture
                    </FormLabel>
                    <Text my={2}>{imgUrlInput}</Text>
                    {preview ? (
                      <Box boxSize="sm">
                        {selectedFile && <Image src={preview} />}
                      </Box>
                    ) : undefined}
                    <Input
                      onChange={handleFile}
                      ref={inputFileRef}
                      id="profilePictureEdit"
                      type="file"
                      display="none"
                    />
                    <Button
                      onClick={() => inputFileRef.current.click()}
                      colorScheme="teal"
                    >
                      Choose File
                    </Button>
                  </FormControl>
                  {userSelector.is_verify ? null : (
                    <Button
                      onClick={() => {
                        resendVerificationButtonHandler(), onClose();
                      }}
                      mt={4}
                    >
                      Verify Your Account
                    </Button>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="outline"
                    me={2}
                    onClick={() => {
                      onClose();
                      setSelectedFile(null);
                      setImgUrlInput("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      formik.handleSubmit(), console.log("test submit");
                    }}
                    disabled={formik.isSubmitting}
                    colorScheme="teal"
                  >
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          </Modal>

          <Text color="gray.500">
            {props.fullName ? `${props.fullName}, ` : undefined}
            {props.email}
          </Text>
          <Text fontSize="md">
            {props.posting} {props.posting > 1 ? "posts" : "post"}
          </Text>
          <Text color="gray.500" mb={2}>
            {props.bio ? props.bio : undefined}
          </Text>
        </Box>
      </Box>
    </Box>
    // </Center>
  );
};

export default UserProfile;

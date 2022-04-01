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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEdit } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosInstance } from "../../config/api";
import { useState } from "react";

const UserProfile = (props) => {
  // const [fullName, setFullName] = useState(userSelector.full_name);
  // const [bio, setBio] = useState(userSelector.bio);
  // const [username, setUsername] = useState(userSelector.username);
  // const [avatarUrl, setAvatarUrl] = useState(userSelector.avatar_url);
  const userSelector = useSelector((state) => state.user);
  const dispatch = useDispatch(); // TODO: change the redux after the profile change

  const { isOpen, onOpen, onClose } = useDisclosure();

  const formik = useFormik({
    initialValues: {
      full_name: userSelector.full_name,
      username: userSelector.username,
      bio: userSelector.bio,
      avatar_url: userSelector.avatar_url,
    },
    validationSchema: yup.object().shape({
      full_name: yup
        .string()
        .required("Full name is required")
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
        const editProfile = {
          username: values.username,
          full_name: values.full_name,
          bio: values.bio,
          avatar_url: values.avatar_url,
        };

        await axiosInstance.patch(`/users/${userSelector.id}`, editProfile);

        // dispatch redux

        onClose();
      } catch (error) {
        console.log(error.message);
      }
    },
  });

  // const inputHandler = (field, e) => {
  //   const { value } = e.target;
  //   if (field === "username") {
  //     setUsername(value);
  //   } else if (field === "fullName") {
  //     setFullName(value);
  //   } else if (field === "bio") {
  //     setBio(value);
  //   } else if (field === "avatarUrl") {
  //     setAvatarUrl(value);
  //   }
  // };

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
        />
        <Box>
          <Text fontWeight="bold" mb={2} fontSize="3xl">
            {props.fullName}{" "}
            {props.id === userSelector.id ? (
              <Icon
                onClick={onOpen}
                as={AiOutlineEdit}
                boxSize={5}
                className="click"
              />
            ) : null}
          </Text>

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
                      Profile Picture Url
                    </FormLabel>
                    <Input
                      onChange={(e) => {
                        formik.setFieldValue("avatar_url", e.target.value);
                      }}
                      id="profilePictureEdit"
                      type="text"
                      value={formik.values.avatar_url}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline" me={2} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={formik.handleSubmit} colorScheme="teal">
                    Save
                  </Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          </Modal>

          <Text fontSize="md">
            {props.posting} {props.posting > 1 ? "posts" : "post"}
          </Text>
          <Text color="gray.500" my={2}>
            {props.bio}
          </Text>
        </Box>
      </Box>
    </Box>
    // </Center>
  );
};

export default UserProfile;

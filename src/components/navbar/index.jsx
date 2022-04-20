import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Image,
  Center,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { BiLogOut, BiHomeSmile, BiLogIn } from "react-icons/bi";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import user_types from "../../redux/reducers/user/types";
import { useState } from "react";
import axiosInstance from "../../config/api";
import moment from "moment";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as yup from "yup";

const Navbar = () => {
  const [imgUrlInput, setImgUrlInput] = useState(""); // only to catch the image name
  const [selectedFile, setSelectedFile] = useState(null); /// for the image file
  const [preview, setPreview] = useState(); // this the state show the preview of the file (Image) if there is any

  const userSelector = useSelector((state) => state.user);

  const router = useRouter();

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // this is for the modal from chakra ui
  const inputFileRef = useRef(null); // this is use to access the html which in this case is the button for the file

  // force refresh
  const refreshPage = () => {
    window.location.reload(false);
  };

  // this function remove the redux, and cookie (when log out) which then automaticaly redirect the user to login page
  const logoutButtonHandler = () => {
    dispatch({
      type: user_types.LOGOUT_USER,
    });

    Cookies.remove("auth_token");

    router.push("/");
  };

  // validator for the input
  const formik = useFormik({
    initialValues: {
      location: "",
      caption: "",
    },
    validationSchema: yup.object().shape({
      location: yup.string(),
      caption: yup.string(),
    }),
    onSubmit: async (values) => {
      if (!selectedFile) {
        alert("Anda belum pilih file");
        return;
      }

      // if the input include a file, the method to send the data is not through body directly
      // it is send through form data, which is a class and to include, use the append method

      const formData = new FormData();

      formData.append("caption", values.caption);
      formData.append("location", values.location);
      formData.append("post_image_file", selectedFile);

      try {
        await axiosInstance.post("/post", formData);
        // after the data is send, the inout holder needs to be emptied to accomodate the next input
        setSelectedFile(null);
        setImgUrlInput("");
        formik.setFieldValue("caption", "");
        formik.setFieldValue("location", "");

        // then the page is force refreshed to show the new data
        refreshPage();
      } catch (err) {
        console.log(err);
      }
    },
  });

  // redirect the user to login page
  const loginButton = () => {
    router.push("/login");
  };

  // this is the function to put the input of a file in the local state before it is sent to backend
  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    setImgUrlInput(event?.target?.files[0]?.name);
  };

  useEffect(() => {
    // won't show prefiew if there is no file
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    // a function to transform the file into a url which then can be show to user
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // function to unset the url
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <Box
      as="nav"
      sx={{ position: "sticky", top: 0, backgroundColor: "white" }}
      zIndex="9"
      boxShadow="md"
    >
      <Box
        // display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={10}
        py={3}
        fontSize="3xl"
        className="grid grid-cols-3"
      >
        <Box className="col-span-1">
          <Link href="/home-page">
            <Icon
              className="hover:cursor-pointer"
              as={BiHomeSmile}
              pb={1}
              boxSize={10}
            />
          </Link>
        </Box>
        <Center>
          <Box className="col-span-1">
            <Text>SmileGram</Text>
          </Box>
        </Center>
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          className="col-span-1"
        >
          {/* it will only show login button when the redux haven't filled (haven't login yet) */}
          {/* show upload button when the redux has been filled (already login) */}
          {userSelector.id ? (
            <Button
              onClick={onOpen}
              me={3}
              rightIcon={<Icon boxSize={6} as={AiOutlinePlus} />}
            >
              Upload
            </Button>
          ) : (
            <Button
              me={3}
              rightIcon={<Icon boxSize={6} as={BiLogIn} />}
              onClick={loginButton}
            >
              Login
            </Button>
          )}

          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel htmlFor="locationInput">Location</FormLabel>
                  <Input
                    onChange={(e) => {
                      formik.setFieldValue("location", e.target.value);
                    }}
                    id="locationInput"
                    placeholder="Input location here"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="captionInput">Caption</FormLabel>
                  <Textarea
                    onChange={(e) => {
                      formik.setFieldValue("caption", e.target.value);
                    }}
                    id="captionInput"
                    placeholder="Input caption here"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="imageInput">Image</FormLabel>
                  <Input
                    onChange={handleFile}
                    ref={inputFileRef}
                    id="imageInput"
                    // placeholder="Input image URL here"
                    type="file"
                    display="none"
                  />
                  <Text my={2}>{imgUrlInput}</Text>
                  {preview ? (
                    <Box boxSize="sm">
                      {selectedFile && <Image src={preview} />}
                    </Box>
                  ) : undefined}
                  <Button
                    onClick={() => inputFileRef.current.click()}
                    colorScheme="facebook"
                  >
                    Choose File
                  </Button>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="outline"
                  me={2}
                  onClick={() => {
                    onClose();
                    setSelectedFile(null);
                    setImgUrlInput("");
                    formik.setFieldValue("caption", "");
                    formik.setFieldValue("location", "");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    formik.handleSubmit();
                  }}
                  disabled={formik.isSubmitting}
                >
                  Post
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* only show menu to redirect to myprofile page and also logout button */}
          {userSelector.id ? (
            <Menu>
              <MenuButton>
                <Flex
                  alignItems="center"
                  backgroundColor="gray.200"
                  borderRadius="2xl"
                  height="40px"
                >
                  <Avatar
                    ms={2}
                    size="sm"
                    src={userSelector.avatar_url}
                    me={1}
                  />
                  <Text p={2} fontSize="lg">
                    Hello, {}
                    {userSelector.full_name || userSelector.username}
                  </Text>
                </Flex>
              </MenuButton>

              <MenuList>
                <Link href="/my-profile">
                  <MenuItem
                    fontSize="xl"
                    icon={<Icon boxSize={5} as={CgProfile} />}
                  >
                    Profile
                  </MenuItem>
                </Link>
                <MenuItem
                  onClick={logoutButtonHandler}
                  fontSize="xl"
                  icon={<Icon boxSize={5} as={BiLogOut} />}
                >
                  Log Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;

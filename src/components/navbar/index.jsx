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
} from "@chakra-ui/react";
import React, { useRef } from "react";
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
  const [locationInput, setLocationInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  // const [imgUrlInput, setImgUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const userSelector = useSelector((state) => state.user);

  const router = useRouter();

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputFileRef = useRef(null);

  const refreshPage = () => {
    window.location.reload(false);
  };

  const logoutButtonHandler = () => {
    dispatch({
      type: user_types.LOGOUT_USER,
    });

    Cookies.remove("auth_token");

    router.push("/welcome-page");
  };

  const formik = useFormik({
    initialValues: {
      location: "",
      caption: "",
    },
    validationSchema: yup.object().shape({
      location: yup.string(),
      caption: yup.string(),
    }),
  });

  const uploadContentHandler = async () => {
    // Proteksi jika file belum dipilih
    if (!selectedFile) {
      alert("Anda belum pilih file");
      return;
    }

    const formData = new FormData();
    const { caption, location } = formik.values;

    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("post_image_file", selectedFile);

    try {
      await axiosInstance.post("/post", formData);
      setSelectedFile(null);
      formik.setFieldValue("caption", "");
      formik.setFieldValue("location", "");

      refreshPage();
    } catch (err) {
      console.log(err);
    }
  };

  const loginButton = () => {
    router.push("/login");
  };

  const handleFile = (event) => {
    setSelectedFile(event.target.files[0]);
    alert(event?.target?.files[0]?.name);
  };

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
        <Box className="col-span-1">
          <InputGroup width="500px">
            <InputLeftElement
              pointerEvents="none"
              children={<Icon as={AiOutlineSearch} color="gray.300" />}
            />
            <Input type="text" placeholder="search" />
          </InputGroup>
        </Box>
        <Box
          display="flex"
          justifyContent="end"
          alignItems="center"
          className="col-span-1"
        >
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
                  <FormLabel htmlFor="imageInput">Image URL</FormLabel>
                  <Input
                    onChange={handleFile}
                    ref={inputFileRef}
                    id="imageInput"
                    // placeholder="Input image URL here"
                    type="file"
                    display="none"
                  />
                  <Button
                    onClick={() => inputFileRef.current.click()}
                    colorScheme="facebook"
                  >
                    Choose File
                  </Button>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" me={2} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="teal" onClick={uploadContentHandler}>
                  Post
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

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
                    {userSelector.full_name}
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
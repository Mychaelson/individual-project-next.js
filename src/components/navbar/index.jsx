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
import React from "react";
import { CgProfile } from "react-icons/cg";
import { AiOutlineSearch, AiOutlinePlus } from "react-icons/ai";
import { BiLogOut, BiHomeSmile, BiLogIn } from "react-icons/bi";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import user_types from "../../redux/reducers/user/types";
import { useState } from "react";
import { axiosInstance } from "../../config/api";
import moment from "moment";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Navbar = () => {
  const [locationInput, setLocationInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [imgUrlInput, setImgUrlInput] = useState("");

  const userSelector = useSelector((state) => state.user);

  const router = useRouter();

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutButtonHandler = () => {
    dispatch({
      type: user_types.LOGOUT_USER,
    });

    Cookies.remove("user_data");

    router.push("/welcome-page");
  };

  const inputHandler = (event, field) => {
    const { value } = event.target;
    if (field === "location") {
      setLocationInput(value);
    } else if (field === "caption") {
      setCaptionInput(value);
    } else if (field === "imgUrl") {
      setImgUrlInput(value);
    }
  };

  const postButtonHandler = () => {
    let today = new Date();

    let date =
      today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();

    // let date = moment().format("MM-DD-YYYY");

    const newPost = {
      userId: userSelector.id,
      location: locationInput,
      likes: 0,
      date: date,
      caption: captionInput,
      likeStatus: false,
      imgUrl: imgUrlInput,
    };

    axiosInstance.post("/contents", newPost);
  };

  const loginButton = () => {
    router.push("/login");
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
            <Icon as={BiHomeSmile} pb={1} boxSize={10} />
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
                      inputHandler(e, "location");
                    }}
                    id="locationInput"
                    placeholder="Input location here"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="captionInput">Caption</FormLabel>
                  <Textarea
                    onChange={(e) => {
                      inputHandler(e, "caption");
                    }}
                    id="captionInput"
                    placeholder="Input caption here"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="imageInput">Image URL</FormLabel>
                  <Input
                    onChange={(e) => {
                      inputHandler(e, "imgUrl");
                    }}
                    id="imageInput"
                    placeholder="Input image URL here"
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" me={2} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="teal" onClick={postButtonHandler}>
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

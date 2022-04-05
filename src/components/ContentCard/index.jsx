import {
  Box,
  Image,
  Text,
  Avatar,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Button,
  Input,
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
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import moment from "moment";
import { useState, useEffect } from "react";
import Comments from "../comments";
import { useFormik } from "formik";
import axiosInstance from "../../config/api";
// import { Link } from "react-router-dom";
import Link from "next/link";
import * as Yup from "yup";
import { useSelector } from "react-redux";

const ContentCard = ({
  username,
  location,
  likes,
  date,
  caption,
  likeStatus,
  imgUrl,
  deleteDataFn,
  likeStatusFnOnclick,
  likeStatusFnDblclick,
  id,
  userId,
  userPhotoProfile,
  post_comments,
}) => {
  const [comment, setcomment] = useState(post_comments);
  const [locationInput, setLocationInput] = useState(location);
  const [captionInput, setCaptionInput] = useState(caption);

  const [displayCommentInput, setDisplayCommentInput] = useState(false);

  const userSelector = useSelector((state) => state.user);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // console.log(Comments);
    // fetchComments();
  }, []);

  // const fetchComments = () => {
  //   axiosInstance
  //     .get(`/comments`, {
  //       params: {
  //         postId: id,
  //         _expand: "user",
  //       },
  //     })
  //     .then((res) => {
  //       setcomments(res.data);
  //     });
  // };

  const renderComments = () => {
    return comment.map((val) => {
      return <Comments username={val?.user?.username} content={val.comment} />;
    });
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  //TODO: yup
  const { setFieldValue, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      comment: "",
    },
    onSubmit: async (values) => {
      const newComment = {
        comment: values.comment,
        post_id: id,
      };
      try {
        await axiosInstance.post("/comment", newComment);
        refreshPage();
      } catch (err) {
        console.log(err);
      }

      // fetchComments();
      setDisplayCommentInput(false);
    },
    validationSchema: Yup.object().shape({
      comment: Yup.string()
        .required("Comment cannot be empty")
        .min(1, "Minimum 1 character")
        .max(50, "maximum 50 characters"),
    }),
  });

  const editPost = useFormik({
    initialValues: {
      location,
      caption,
    },
    validationSchema: Yup.object().shape({
      location: Yup.string()
        .min(3, "Minimum 3 character")
        .max(20, "maximum 20 characters"),
    }),
    onSubmit: async (values) => {
      const editPost = {
        location: values?.location,
        caption: values?.caption,
      };

      try {
        await axiosInstance.patch(`/post/${id}`, editPost);

        onClose();
      } catch (err) {
        console.log(err);
      }
    },
  });

  let profileRedirect;

  if (userId === userSelector.id) {
    profileRedirect = "/my-profile";
  } else {
    profileRedirect = `/profile/${userId}`;
  }

  return (
    <Center>
      <Box
        w="500px"
        rounded="10px"
        overflow="auto"
        boxShadow="2xl"
        mt={3}
        mb={2}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          my={2}
        >
          <Box display="flex" alignItems="center">
            <Avatar size="md" name="user" src={userPhotoProfile} marginX={3} />
            <div>
              <Link href={profileRedirect}>
                <Text
                  className="hover:cursor-pointer"
                  fontWeight={"bold"}
                  fontSize="xl"
                >
                  {username}
                </Text>
              </Link>
              <Text color="gray.500" fontSize="smaller">
                {location}
              </Text>
            </div>
          </Box>
          <div>
            <Menu>
              <MenuButton>
                <Icon
                  as={BiDotsVerticalRounded}
                  className="click"
                  boxSize={6}
                  my={4}
                  mx={3}
                />
              </MenuButton>
              <MenuList>
                <Link href={`/content-detail/${id}`}>
                  <MenuItem>Detail Post</MenuItem>
                </Link>
                {userId === userSelector.id ? (
                  <>
                    <MenuItem onClick={onOpen}>Edit Post</MenuItem>
                    <MenuItem onClick={deleteDataFn}>Delete</MenuItem>
                  </>
                ) : null}
              </MenuList>
            </Menu>

            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel htmlFor="locationInput">Location</FormLabel>
                    <Input
                      onChange={(e) => {
                        editPost.setFieldValue("location", e.target.value);
                      }}
                      value={editPost.values.location}
                      id="locationInput"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="captionInput">Caption</FormLabel>
                    <Textarea
                      onChange={(e) => {
                        editPost.setFieldValue("caption", e.target.value);
                      }}
                      value={editPost.values.caption}
                      id="captionInput"
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline" me={2} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={editPost.handleSubmit} colorScheme="teal">
                    Edit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </Box>
        <Image
          onDoubleClick={likeStatusFnDblclick}
          src={imgUrl}
          alt="View"
          objectFit="inherit"
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            {likeStatus ? (
              <Icon
                as={AiFillHeart}
                onClick={likeStatusFnOnclick}
                color="red"
                boxSize={8}
                mt={3}
                ms={3}
                className="click"
              />
            ) : (
              <Icon
                as={AiOutlineHeart}
                onClick={likeStatusFnOnclick}
                color="black"
                boxSize={8}
                mt={3}
                ms={3}
                className="click"
              />
            )}
            <Icon
              as={FaRegComment}
              onClick={() => {
                displayCommentInput
                  ? setDisplayCommentInput(false)
                  : setDisplayCommentInput(true);
              }}
              boxSize={7}
              mt={3}
              ms={3}
              className=" click"
            />
          </Box>
          <Text mt={4} me={4} color="gray.500" fontSize="xs">
            {moment(date).format("MMM DD, YYYY")}
          </Text>
        </Box>
        <Text ps={4} pt={3} fontSize="sm">
          {likes} Likes
        </Text>
        <Box>
          <Text fontSize="md" px={4} py={1}>
            <span className="font-bold">{username}</span>{" "}
            <span className="font-light"> - {caption} </span>
          </Text>
        </Box>
        <Box paddingX="4" marginBottom={4}>
          <Text fontSize="md" pt={0} decoration="underline">
            Comments
          </Text>
          {renderComments()}
          {displayCommentInput ? (
            <Box display="flex" alignItems="center" mt={2}>
              {/* <Form> */}
              <Input
                onChange={(e) => setFieldValue("comment", e.target.value)}
                type="text"
                placeholder="Input Comment here"
              />
              {/* </Form> */}
              <Button
                onClick={() => handleSubmit()}
                colorScheme="teal"
                type="submit"
                ms={2}
              >
                Post
              </Button>
            </Box>
          ) : null}

          {/* formik is not defined beacuse the useformik doesn't have variable name */}
          {errors.comment && touched.comment && <p>{errors.comment}</p>}
        </Box>
      </Box>
    </Center>
  );
};

export default ContentCard;

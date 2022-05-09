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
import Link from "next/link";
import * as Yup from "yup";
import { useSelector } from "react-redux";

const DetailPost = ({
  username,
  location,
  likes,
  date,
  caption,
  likeStatus,
  imgUrl,
  deleteDataFn,
  id,
  userId,
  userPhotoProfile,
  post_comments,
  addLike,
  removeLike,
  seeMoreCommentButtonHandler,
  numberOfPageForComment,
  isDetailPost,
}) => {
  const [displayCommentInput, setDisplayCommentInput] = useState(false); // toggle to wheter show the input box or hide it
  const [like_status, setLikeStatus] = useState(likeStatus);
  // to show wheter the post has been liked by the user that logged in
  // the icon will be adjust according to the state and the fuction will also be adjusted
  const [comment, setComment] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [numberOfComment, setNumberOfComment] = useState(0);

  useEffect(() => {
    setLikeStatus(likeStatus);
    fetchComments();
  }, [likeStatus]);
  // the use effect is used because the first likestatus send from the page is false
  // and then there is changes in only the page but the component will not set the value to the newest likestatus,
  // therefor, if there is any changes of the likestatus, the useefect will set the state to the newest values

  console.log(comment);

  const userSelector = useSelector((state) => state.user);

  const { isOpen, onOpen, onClose } = useDisclosure(); // to manipulate the modal from chakra ui

  // function to render all of the comments which will be called on the place that the comments want to be shown in the html
  const renderComments = () => {
    return comment.map((val) => {
      return <Comments username={val?.user?.username} content={val.comment} />;
    });
  };

  const maxCommentPerCommentPage = 5;

  // this will fetch all the comment seperately from the post and the user for pagination of the comment section
  const fetchComments = async () => {
    try {
      const commentResult = await axiosInstance.get("/comment", {
        params: {
          post_id: id,
          _limit: maxCommentPerCommentPage,
          _page: commentPage,
        },
      });
      console.log(commentResult, "test1");
      // it will receive comments base on the post id from params

      // then it will add the comment to existing comment
      setComment((prevComments) => [
        ...prevComments,
        ...commentResult.data.result.rows,
      ]);

      setCommentPage(commentPage + 1);
      setNumberOfComment(commentResult.data.result.count);
    } catch (err) {
      console.log(err);
      // Toast({
      //   title: "Fetch Data Failed",
      //   description: err.response.data.message,
      //   status: "info",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "top",
      // });
    }
  };

  const refreshPage = () => {
    // force refresh
    window.location.reload(false);
  };

  // formik for the comment input
  const { setFieldValue, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      comment: "",
    },
    onSubmit: async (values) => {
      // the comment will be set on an object to impove readability of the axiosInstance code
      const newComment = {
        comment: values.comment,
        post_id: id,
      };
      try {
        await axiosInstance.post("/comment", newComment);
        const newestComment = {
          comment: values.comment,
          user: {
            username: userSelector.username,
          },
        };
        setComment([newestComment, ...comment]);
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
        .max(300, "maximum 300 characters"),
    }),
  });

  // formik for edit post
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

        // after the process succes the modal for edit post will be close, then the page will be refreshed
        onClose();
        refreshPage();
      } catch (err) {
        console.log(err);
      }
    },
  });

  // the profile redirect variable will be used to check whether the profile page will be others or user own profile and will be send to respective page
  let profileRedirect;
  if (userId === userSelector.id) {
    profileRedirect = "/my-profile";
  } else {
    profileRedirect = `/profile/${userId}`;
  }

  // this fuction is to delete post which comes from the page, passed using state and props that the fuction is send (home-page or content-detail-page)
  const deletePostButtonHandler = () => {
    deleteDataFn();

    refreshPage();
  };

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
            {isDetailPost && userId !== userSelector.id ? undefined : (
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
                  {isDetailPost && userId === userSelector.id ? undefined : (
                    <Link href={`/content-detail/${id}`}>
                      <MenuItem>Detail Post</MenuItem>
                    </Link>
                  )}
                  {/* if the user_id of the post is the same as the id of the user that logged in,
                then the menu to edit and delete the post will show */}
                  {userId === userSelector.id ? (
                    <>
                      <MenuItem onClick={onOpen}>Edit Post</MenuItem>
                      <MenuItem onClick={deletePostButtonHandler}>
                        Delete
                      </MenuItem>
                    </>
                  ) : null}
                </MenuList>
              </Menu>
            )}

            {/* modal for edit post */}
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
          onDoubleClick={() => {
            addLike();
            setLikeStatus(true);
          }}
          // doubleclicking the image of the post will trigger like post function
          src={imgUrl}
          alt="View"
          objectFit="inherit"
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            {/* the icon will be shown based on the likestatus toggle in the local state */}
            {like_status ? (
              <Icon
                as={AiFillHeart}
                onClick={() => {
                  removeLike();
                  setLikeStatus(false);
                }}
                color="red"
                boxSize={8}
                mt={3}
                ms={3}
                className="click"
              />
            ) : (
              <Icon
                as={AiOutlineHeart}
                onClick={() => {
                  addLike();
                  setLikeStatus(true);
                }}
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
          {likes.toLocaleString()} Likes
        </Text>
        <Box>
          <Text fontSize="md" px={4} py={1}>
            <span className="font-bold">{username}</span>{" "}
            <span className="font-light">
              {" "}
              {caption ? "-" : undefined} {caption}{" "}
            </span>
          </Text>
        </Box>
        <Box paddingX="4" marginBottom={4}>
          <Text fontSize="md" pt={0} decoration="underline">
            Comments
          </Text>
          {renderComments()}
          {commentPage <=
          Math.ceil(numberOfComment / maxCommentPerCommentPage) ? (
            <Text color="gray.500" onClick={fetchComments}>
              See More Comments
            </Text>
          ) : undefined}
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

export default DetailPost;

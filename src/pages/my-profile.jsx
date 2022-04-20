import {
  Box,
  Center,
  useToast,
  Spinner,
  Icon,
  Divider,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../config/api";
import Feeds from "../components/userFeed";
import UserProfile from "../components/userProfile";
import requiresAuth from "../config/requireAuth";
import axios from "axios";
import { AiOutlineAppstore, AiFillAppstore } from "react-icons/ai";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { useRouter } from "next/router";

// userData is from getServerSideProps in the end of the code
const MyProfilePage = ({ userData }) => {
  const [userPosts, setuserPosts] = useState(userData.user_posts);
  const [dataLength, setDataLength] = useState(userData.user_posts.length);
  const [isLoading, setIsLoading] = useState(false);
  const [currentList, setCurrentList] = useState(true);
  const [postUserLiked, setPostUserLiked] = useState([]);

  const Toast = useToast();
  const router = useRouter();

  // userSelector is a way to access the redux through useSelector hooks
  const userSelector = useSelector((state) => state.user);

  useEffect(() => {
    // this proccess must be only triggered after the redux has been filled because the fuction will took teh user id from redux
    if (userSelector.id) {
      fetchPostThatUserLiked();
    }
  }, [userSelector.id]);

  // data is used for showing the post that the user has liked, tehn set the result to local state
  const fetchPostThatUserLiked = async () => {
    try {
      const res = await axiosInstance.get(
        `/post/get_post_user_liked/${userSelector.id}`
      );

      const post = res?.data?.result?.rows;

      setPostUserLiked(post);
    } catch (err) {
      console.log(err);
    }
  };

  // render the data from localstate for post that the user has liked
  const renderLikedPost = () => {
    console.log(postUserLiked);
    return postUserLiked.map((val) => {
      console.log(val?.post?.image_url, val?.post?.id);
      return <Feeds imgUrl={val?.post?.image_url} id={val?.post?.id} />;
    });
  };

  // render the user own post's
  const renderPost = () => {
    return userPosts.map((val) => {
      return <Feeds imgUrl={val.image_url} id={val.id} />;
    });
  };

  return (
    <>
      <Center>{isLoading ? <Spinner size="lg" mt={4} /> : null}</Center>
      <Center>
        <Box width="50%" mt={4}>
          {/* userProfile is a reuseable component */}
          {isLoading ? null : (
            <UserProfile
              username={userSelector.username}
              bio={userSelector.bio}
              fullName={userSelector.full_name}
              posting={dataLength}
              avatarUrl={userSelector.avatar_url}
              id={userSelector.id}
              userData={userData}
              is_verify={userSelector.is_verify}
              email={userSelector.email}
            />
          )}
          {/* the flex below is for the menu to show between the user own post's or the post that the user has liked */}
          <Flex
            justifyContent={"space-evenly"}
            alignItems={"center"}
            mt={4}
            mb={2}
            pl={16}
            height="40px"
            borderBottom={"1px solid"}
            borderColor={"blackAlpha.200"}
          >
            <Icon
              as={currentList ? AiFillAppstore : AiOutlineAppstore}
              boxSize={currentList ? 9 : 8}
              onClick={() => {
                setCurrentList(true);
              }}
            />
            <Icon
              as={currentList ? BsHeart : BsHeartFill}
              boxSize={currentList ? 7 : 8}
              onClick={() => {
                setCurrentList(false);
              }}
            />
          </Flex>
          <Box ms={4} mt={8} display="flex" flexWrap="wrap">
            {currentList ? renderPost() : renderLikedPost()}
          </Box>
        </Box>
      </Center>
    </>
  );
};

export const getServerSideProps = requiresAuth(async (context) => {
  // the token is taken from context.req which is an object from nextjs and inside contain a token, named as auth_token
  // then the token is putted into a variable to be send to backend trough headers under the name of authorization
  // then the result from backend is send through props to be recieved in component props
  const token = context.req.cookies.auth_token;

  const res = await axios.get(`http://localhost:2000/user/my-profile`, {
    headers: {
      Authorization: token,
    },
  });

  const data = res.data.profile;

  return {
    props: {
      userData: data,
    },
  };
});

export default MyProfilePage;

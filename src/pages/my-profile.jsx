import { Box, Center, useToast, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../config/api";
import Feeds from "../components/userFeed";
import Link from "next/link";
import UserProfile from "../components/userProfile";
import requiresAuth from "../config/requireAuth";
import axios from "axios";
import jsonwebtoken from "jsonwebtoken";

// ini untuk page sendiri
// klo ad perubahan profile, setelah oatch, harus update reduxnya

const MyProfilePage = ({ userData }) => {
  // const [userData, setUserData] = useState(userData);
  const [userPosts, setuserPosts] = useState(userData.user_posts);
  const [dataLength, setDataLength] = useState(userData.user_posts.length);
  const [isLoading, setIsLoading] = useState(false);

  const Toast = useToast();
  const userSelector = useSelector((state) => state.user);

  useEffect(() => {}, []);

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
            />
          )}
          <Box ms={4} mt={4} display="flex" flexWrap="wrap">
            {renderPost()}
          </Box>
        </Box>
      </Center>
    </>
  );
};

export const getServerSideProps = requiresAuth(async (context) => {
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

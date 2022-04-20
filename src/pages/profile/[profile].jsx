import React, { useEffect } from "react";
import { Center, Box, Spinner, useToast } from "@chakra-ui/react";
import Feeds from "../../components/userFeed";
import { useState } from "react";
import UserProfile from "../../components/userProfile";
import axiosInstance from "../../config/api";
import { useRouter } from "next/router";
import requiresAuth from "../../config/requireAuth";

const ProfilePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [dataUser, setDataUser] = useState({});

  const router = useRouter();
  const Toast = useToast();

  // fetching the user data also include the post from that user with the same user id
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/user", {
        params: {
          user_id: router.query.profile,
        },
      });

      setData(res.data.profile.user_posts);
      setDataLength(res.data.profile.user_posts.length);
      setDataUser(res.data.profile);
      setIsLoading(false);
    } catch (err) {
      Toast({
        title: "Fetch Data Failed",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    // router.isready is a router object and this will ensure that the params is finished rendered as it is rendered clinet side,
    // then the fetching is execute
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  // this function render the image
  const renderData = () => {
    return data.map((val) => {
      return <Feeds id={val.id} imgUrl={val.image_url} />;
    });
  };

  return (
    <>
      <Center>{isLoading ? <Spinner size="lg" mt={4} /> : null}</Center>
      <Center>
        <Box width="50%" mt={4}>
          {isLoading ? null : (
            <UserProfile
              username={dataUser.username}
              bio={dataUser.bio}
              fullName={dataUser.full_name}
              posting={dataLength}
              avatarUrl={dataUser.avatar_img}
              id={dataUser.id}
              is_verify={dataUser.is_verified}
              email={dataUser.email}
            />
          )}
          <Box ms={4} mt={4} display="flex" flexWrap="wrap">
            {renderData()}
          </Box>
        </Box>
      </Center>
    </>
  );
};

// this protect the page so that it can only be accessed by user that have logged in
export const getServerSideProps = requiresAuth((context) => {
  return {
    props: {},
  };
});

export default ProfilePage;

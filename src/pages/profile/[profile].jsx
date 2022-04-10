import React, { useEffect } from "react";
import { Center, Box, Spinner, useToast } from "@chakra-ui/react";
import Feeds from "../../components/userFeed";
import { useState } from "react";
import UserProfile from "../../components/userProfile";
// import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../config/api";
import { useRouter } from "next/router";
import Link from "next/link";
import requiresAuth from "../../config/requireAuth";

const ProfilePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [dataUser, setDataUser] = useState({});

  const router = useRouter();
  const Toast = useToast();

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
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  const renderData = () => {
    return data.map((val) => {
      return (
        <Link href={`/content-detail/${val.id}`}>
          <Feeds imgUrl={val.image_url} />
        </Link>
      );
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

export const getServerSideProps = requiresAuth((context) => {
  return {
    props: {},
  };
});

export default ProfilePage;

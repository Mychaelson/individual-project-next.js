import React, { useEffect } from "react";
import { Center, Box, Spinner, useToast } from "@chakra-ui/react";
import Feeds from "../../components/userFeed";
import { useState } from "react";
import UserProfile from "../../components/userProfile";
// import { Link, useParams } from "react-router-dom";
import { axiosInstance } from "../../config/api";

import { useRouter } from "next/router";
import Link from "next/link";

const ProfilePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [dataUser, setDataUser] = useState({});

  const router = useRouter();
  const Toast = useToast();

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      axiosInstance
        .get(`/contents`, {
          params: {
            _expand: "user",
            userId: router.query.profile,
          },
        })
        .then((res) => {
          setData(res.data);
          setDataLength(res.data.length);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 2000);
  };

  const fetchDataUser = () => {
    setIsLoading(true);
    setTimeout(() => {
      axiosInstance
        .get(`/users/${router.query.profile}`)
        .then((res) => {
          setDataUser(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          Toast({
            title: "Fetch Data Failed",
            description: "Server Error.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        });
    }, 2000);
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
      fetchDataUser();
      console.log(router.query.profile);
    }
  }, [router.isReady]);

  const renderData = () => {
    return data.map((val) => {
      return (
        <Link href={`/content-detail/${val.id}`}>
          <Feeds imgUrl={val.imgUrl} />
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
              username={dataUser.user_name}
              bio={dataUser.bio}
              fullName={dataUser.full_name}
              posting={dataLength}
              avatarUrl={dataUser.avatar_url}
              id={dataUser.id}
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

export default ProfilePage;

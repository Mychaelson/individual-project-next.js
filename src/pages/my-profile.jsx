import { Box, Center, useToast, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../config/api";
import Feeds from "../components/userFeed";
import Link from "next/link";
import UserProfile from "../components/userProfile";
import requiresAuth from "../config/requireAuth";

// ini untuk page sendiri
// klo ad perubahan profile, setelah oatch, harus update reduxnya

const MyProfilePage = () => {
  // const [userData, setUserData] = useState({});
  const [userPosts, setuserPosts] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const Toast = useToast();
  const userSelector = useSelector((state) => state.user);

  // const fetchUserData = () => {
  //   axiosInstance
  //     .get("/users", {
  //       params: {
  //         username: userSelector.username,
  //       },
  //     })
  //     .then((res) => {
  //       const userInfo = res.data[0];
  //       console.log(userInfo);
  //       setUserData(userInfo);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const fetchUserPost = () => {
    setIsLoading(true);
    setTimeout(() => {
      axiosInstance
        .get("/contents", {
          params: {
            _expand: "user",
            userId: userSelector.id,
          },
        })
        .then((res) => {
          // console.log(res.data);
          setuserPosts(res.data);
          setDataLength(res.data.length);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 2000);
  };

  useEffect(() => {
    // fetchUserData();
    // console.log(userSelector.bio);
    fetchUserPost();
  }, []);

  const renderPost = () => {
    return userPosts.map((val) => {
      return <Feeds imgUrl={val.imgUrl} id={val.id} />;
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

export const getServerSideProps = requiresAuth((context) => {
  return {
    props: {},
  };
});

export default MyProfilePage;

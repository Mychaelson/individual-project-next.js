import ContentCard from "../components/ContentCard";
import * as React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
// import "../assets/style.css";
import axiosInstance from "../config/api";
import Navbar from "../components/navbar";
import Page from "../components/Page";
import { useSelector } from "react-redux";

function HomePage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userSelector = useSelector((state) => state.user);

  useEffect(() => {
    fetchData();
  }, []);

  const Toast = useToast();

  const renderData = () => {
    return data.map((val, idx) => {
      let like_status;

      if (val?.post_like?.length) {
        like_status = true;
      } else {
        like_status = false;
      }
      return (
        <ContentCard
          username={val?.user_posts?.username}
          location={val?.location}
          likes={val?.like_count}
          date={val?.createdAt}
          caption={val?.caption}
          // likeStatusFnOnclick={() => editLikes(val.id, true, idx)}
          likeStatusFnDblclick={() => editLikes(val.id, false, idx)}
          addLike={() => {
            addLike(val?.id, userSelector.id, idx);
          }}
          removeLike={() => {
            removeLike(val.id, userSelector.id, idx);
          }}
          deleteDataFn={() => deleteData(val.id)}
          imgUrl={val?.image_url}
          id={val?.id}
          userId={val?.user_posts?.id}
          userPhotoProfile={val?.user_posts?.avatar_img}
          post_comments={val?.comments}
          likeStatus={like_status}
        />
      );
    });
  };

  // const editLikes = async (id, oneClick = false, idx) => {
  //   const dataToFind = data.find((val) => {
  //     return val.id === id;
  //   });

  //   try {
  //     if (!dataToFind.likeStatus && oneClick) {
  //       await axiosInstance.post(`/post/${id}/likes/${userSelector.id}`);
  //     } else if (dataToFind.likeStatus && oneClick) {
  //       await axiosInstance.delete(`/post/${id}/likes/${userSelector.id}`);
  //     } else if (!dataToFind.likeStatus) {
  //       await axiosInstance.post(`/post/${id}/likes/${userSelector.id}`);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const addLike = async (post_id, user_id, idx) => {
    try {
      await axiosInstance.post(`/post/${post_id}/likes/${user_id}`);
      ``;

      let newArr = [...data];
      newArr[idx].like_count++;
      setData(newArr);
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async (post_id, user_id, idx) => {
    try {
      await axiosInstance.delete(`/post/${post_id}/likes/${user_id}`);

      let newArr = [...data];
      newArr[idx].like_count--;
      setData(newArr);
    } catch (err) {
      console.log(err);
    }
  };

  // const changeLikeStatus = (id, oneClick = false, idx) => {
  //   const dataToFind = data.find((val) => {
  //     return val.id === id;
  //   });

  //   if (!dataToFind.likeStatus && oneClick) {
  //     let likesIncrement = dataToFind.likes + 1;
  //     axiosInstance.post(`/post/${id}/likes/${userSelector.id}`).then(() => {
  //       let newArr = [...data];
  //       newArr[idx].like_count++;
  //       // newArr[idx].likeStatus = !newArr[idx].likeStatus;
  //       setData(newArr);
  //     });
  //   } else if (dataToFind.likeStatus && oneClick) {
  //     let likesDecrement = dataToFind.likes - 1;
  //     axiosInstance
  //       .patch(`/contents/${id}`, {
  //         likes: likesDecrement,
  //         likeStatus: !dataToFind,
  //       })
  //       .then(() => {
  //         let newArr = [...data];
  //         newArr[idx].likes--;
  //         newArr[idx].likeStatus = !newArr[idx].likeStatus;
  //         setData(newArr);
  //       });
  //   } else if (!dataToFind.likeStatus) {
  //     let likesIncrement = dataToFind.likes + 1;
  //     axiosInstance
  //       .patch(`/contents/${id}`, {
  //         likes: likesIncrement,
  //         likeStatus: !dataToFind.likeStatus,
  //       })
  //       .then(() => {
  //         let newArr = [...data];
  //         newArr[idx].likes++;
  //         newArr[idx].likeStatus = !newArr[idx].likeStatus;
  //         setData(newArr);
  //       });
  //   }
  // };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/post", {
        params: {
          _limit: 10,
          _page: 1,
          _sortBy: "createdAt",
          _sortDir: "DESC",
        },
      });

      const allPost = res.data.result.rows;

      setData(allPost);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
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

  const deleteData = (id) => {
    let confirmDelete = window.confirm("Delete the post?");

    if (confirmDelete) {
      axiosInstance.delete(`/post/${id}`).then(() => {
        fetchData();
      });
    }
  };

  return (
    <Page>
      <Box mt={3}>
        <Center>{isLoading ? <Spinner size="lg" /> : null}</Center>
        {renderData()}
      </Box>
    </Page>
  );
}

export default HomePage;

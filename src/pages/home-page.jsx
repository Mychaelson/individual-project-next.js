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
import { axiosInstance } from "../config/api";
import Navbar from "../components/navbar";
import Page from "../components/Page";

function HomePage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const Toast = useToast();

  const renderData = () => {
    return data.map((val, idx) => {
      return (
        <ContentCard
          username={val?.user?.username}
          location={val?.location}
          likes={val?.likes}
          date={val?.date}
          caption={val?.caption}
          likeStatus={val?.likeStatus}
          likeStatusFnOnclick={() => changeLikeStatus(val.id, true, idx)}
          likeStatusFnDblclick={() => changeLikeStatus(val.id, false, idx)}
          deleteDataFn={() => deleteData(val.id)}
          imgUrl={val?.imgUrl}
          id={val?.id}
          userId={val.userId}
          userPhotoProfile={val?.user?.avatar_url}
        />
      );
    });
  };

  const changeLikeStatus = (id, oneClick = false, idx) => {
    const dataToFind = data.find((val) => {
      return val.id === id;
    });

    if (!dataToFind.likeStatus && oneClick) {
      let likesIncrement = dataToFind.likes + 1;
      axiosInstance
        .patch(`/contents/${id}`, {
          likes: likesIncrement,
          likeStatus: !dataToFind.likeStatus,
        })
        .then(() => {
          let newArr = [...data];
          newArr[idx].likes++;
          newArr[idx].likeStatus = !newArr[idx].likeStatus;
          setData(newArr);
        });
    } else if (dataToFind.likeStatus && oneClick) {
      let likesDecrement = dataToFind.likes - 1;
      axiosInstance
        .patch(`/contents/${id}`, {
          likes: likesDecrement,
          likeStatus: !dataToFind,
        })
        .then(() => {
          let newArr = [...data];
          newArr[idx].likes--;
          newArr[idx].likeStatus = !newArr[idx].likeStatus;
          setData(newArr);
        });
    } else if (!dataToFind.likeStatus) {
      let likesIncrement = dataToFind.likes + 1;
      axiosInstance
        .patch(`/contents/${id}`, {
          likes: likesIncrement,
          likeStatus: !dataToFind.likeStatus,
        })
        .then(() => {
          let newArr = [...data];
          newArr[idx].likes++;
          newArr[idx].likeStatus = !newArr[idx].likeStatus;
          setData(newArr);
        });
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      axiosInstance
        .get("/contents/", {
          params: {
            _expand: "user",
            _sort: "date",
            _order: "desc",
          },
        })
        .then((res) => {
          setData(res.data);
          setIsLoading(false);
        })
        // axiosInstance
        //   .get("/contents")
        //   .then((res) => {
        //     setData(res.data.result);
        //     setIsLoading(false);
        //   })
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

  const deleteData = (id) => {
    let confirmDelete = window.confirm("Delete the post?");

    if (confirmDelete) {
      axiosInstance.delete(`/contents/${id}`).then(() => {
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

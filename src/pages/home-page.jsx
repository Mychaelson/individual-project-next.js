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
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
// import "../assets/style.css";
import axiosInstance from "../config/api";
import Navbar from "../components/navbar";
import Page from "../components/Page";
import { useSelector } from "react-redux";
import requiresAuth from "../config/requireAuth";
import InfiniteScroll from "react-infinite-scroll-component";

function HomePage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataLength, setDataLength] = useState(0);
  const userSelector = useSelector((state) => state.user);

  useEffect(() => {
    fetchData();
  }, [page]);

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

  const addLike = async (post_id, user_id, idx) => {
    try {
      await axiosInstance.post(`/post/${post_id}/likes/${user_id}`);

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

  const maxPostPerPage = 5;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/post", {
        params: {
          _limit: maxPostPerPage,
          _page: page,
          _sortBy: "createdAt",
          _sortDir: "DESC",
        },
      });

      const allPost = res.data.result.rows;

      setData([...data, ...allPost]);
      setIsLoading(false);
      setDataLength(res.data.result.count);
    } catch (err) {
      setIsLoading(false);
      console.log(err.response.data.message);
    }
  };

  const fecthNextPage = () => {
    if (page < Math.ceil(dataLength / maxPostPerPage)) {
      setPage(page + 1);
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
        <InfiniteScroll
          dataLength={data.length}
          next={fecthNextPage}
          hasMore={page < Math.ceil(dataLength / maxPostPerPage)}
          loader={<Spinner size="lg" />}
          endMessage={
            <Center>
              <Text>No more post available</Text>
            </Center>
          }
        >
          {renderData()}
        </InfiniteScroll>
      </Box>
    </Page>
  );
}

export const getServerSideProps = requiresAuth((context) => {
  return {
    props: {},
  };
});

export default HomePage;

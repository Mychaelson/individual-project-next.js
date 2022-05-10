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
import AOS from "aos";
import "aos/dist/aos.css";

function HomePage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataLength, setDataLength] = useState(0);
  const userSelector = useSelector((state) => state.user);

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    AOS.init({ duration: 2000 });
    AOS.refresh();
  }, []);

  const Toast = useToast();

  // the like status is gotton from chcking the length of post_like
  // if there is any, it means the post has been like by the user taht is logged in
  const renderData = () => {
    return data.map((val, idx) => {
      let like_status;

      if (val?.post_like?.length) {
        like_status = true;
      } else {
        like_status = false;
      }
      return (
        <Box data-aos="fade-up">
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
        </Box>
      );
    });
  };

  // first send a request to backend to add like and then manually increase the like count for the post on local state
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

  // similar to like, just the opposite, which reduce the like count and delete the like on back end
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

  // there is limit on the data that will be fetch each request for pagination
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

      // for infinite scroll, the data will be added to the previous data
      setData([...data, ...allPost]);
      setIsLoading(false);
      setDataLength(res.data.result.count);
    } catch (err) {
      setIsLoading(false);
      console.log(err.response.data.message);
    }
  };

  // the data will be fetch again by calling this function, and the use efect will be triggered to fetch other data
  const fecthNextPage = () => {
    if (page < Math.ceil(dataLength / maxPostPerPage)) {
      setPage(page + 1);
    }
  };

  // ask for confirimation, then delete the post
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

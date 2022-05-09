import axios from "axios";
import { useEffect, useState } from "react";
import ContentCard from "../../components/ContentCard";
import {
  Spinner,
  Center,
  useToast,
  Stack,
  IconButton,
  Box,
  Text,
  Icon,
} from "@chakra-ui/react";
import axiosInstance from "../../config/api";
import Page from "../../components/Page";
import { useRouter } from "next/router";
import requiresAuth from "../../config/requireAuth";
import { WEB_URL } from "../../config/url";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { BiCopy } from "react-icons/bi";
import DetailPost from "../../components/detailPost";

const ContentDetail = ({ detailPostData }) => {
  const [data, setData] = useState(detailPostData);
  const [isLoading, setIsLoading] = useState(false);
  const [postIsLiked, setPostIsLiked] = useState(false);
  const router = useRouter();
  const Toast = useToast();

  useEffect(() => {
    checkUserLikedPost();
  }, []);

  // function to add like and also manipulate the local state so there is no need to send a request to get the newest data
  const addLike = async (post_id, user_id) => {
    try {
      await axiosInstance.post(`/post/${post_id}/likes/${user_id}`);

      let newArr = { ...data };
      newArr.like_count++;
      setData(newArr);
      setPostIsLiked(true);
    } catch (err) {
      console.log(err);
    }
  };

  // remove like function also work the same as add like function
  const removeLike = async (post_id, user_id) => {
    try {
      await axiosInstance.delete(`/post/${post_id}/likes/${user_id}`);

      let newArr = { ...data };
      newArr.like_count--;
      setData(newArr);
      setPostIsLiked(false);
    } catch (err) {
      console.log(err);
    }
  };

  // this function delete the post and the redirect the user to home-page
  const deleteData = (id) => {
    let confirmDelete = window.confirm("Delete the post?");

    if (confirmDelete) {
      axiosInstance.delete(`/post/${id}`).then(() => {
        router.push("/home-page");
      });
    }
  };

  // this function is used to set state on whenter the user has liked the post or not
  // then the icon and fuction will be put accoringly to the state
  const checkUserLikedPost = async () => {
    try {
      const isPostLiked = await axiosInstance.get(
        `/post/userLikedPost?post_id=${data?.id}`
      );

      if (isPostLiked.data.result) {
        console.log(isPostLiked.data.result);
        setPostIsLiked(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // this function is to copy the current link to the clipboard and show toast
  const copyLinkBtnHandler = () => {
    navigator.clipboard.writeText(`${WEB_URL}${router.asPath}`);

    Toast({
      position: "top-right",
      status: "info",
      title: "Link copied",
    });
  };

  return (
    <Page
      title={`${data?.caption}`}
      description={`${data?.user_posts?.username} || ${data?.caption}`}
      image={data?.image_url}
      url={`${WEB_URL}${router.asPath}`}
    >
      <div className="mt-3">
        <Center>{isLoading ? <Spinner size="lg" /> : null}</Center>
        {/* {renderData()} */}
        {isLoading ? null : (
          <DetailPost
            username={data?.user_posts?.username}
            location={data?.location}
            likes={data?.like_count || 0}
            caption={data?.caption}
            likeStatus={postIsLiked}
            addLike={() => {
              addLike(data?.id, data?.user_id);
            }}
            removeLike={() => {
              removeLike(data?.id, data?.user_id);
            }}
            deleteDataFn={() => deleteData(data.id)}
            imgUrl={data?.image_url}
            id={data?.id}
            userId={data?.user_id}
            userPhotoProfile={data?.user_posts?.avatar_img}
            date={data?.createdAt}
            isDetailPost={true}
          />
        )}
      </div>
      <Center>
        <Box mb={4}>
          <Text fontWeight="medium">Share this Post to your friends!</Text>
          <Stack mt={2} direction="row">
            <FacebookShareButton
              url={`${WEB_URL}${router.asPath}`}
              quote={`${data?.caption}`}
            >
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <TwitterShareButton
              title={`${data?.caption}`}
              url={`${WEB_URL}${router.asPath}`}
            >
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <WhatsappShareButton
              url={`${WEB_URL}${router.asPath}`}
              title={`${data?.caption}`}
              separator={" || "}
            >
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
            <IconButton
              onClick={copyLinkBtnHandler}
              borderRadius="50%"
              icon={<Icon as={BiCopy} />}
            />
          </Stack>
        </Box>
      </Center>
    </Page>
  );
};

// fetch the data server side mainly for share content purposes
export const getServerSideProps = async (context) => {
  try {
    const res = await axios.get(
      `http://localhost:2000/post/getPostWithoutLike`,
      {
        params: {
          id: context.query.contentDetail,
        },
        // headers: {
        //   Authorization: context.req.cookies.auth_token,
        // },
      }
    );

    // the result then will be send through object with property props and receive in the page props
    const data = res.data.result.rows[0];
    return {
      props: {
        detailPostData: data,
      },
    };
  } catch (err) {
    // it must also use try catch, and if the request failed, it will also return the props with value of null
    console.log(err.response.data);
    return {
      props: {
        detailPostData: null,
      },
    };
  }
};

export default ContentDetail;

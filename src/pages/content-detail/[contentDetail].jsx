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

const ContentDetail = ({ detailPostData }) => {
  const [data, setData] = useState(detailPostData);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [numberOfComment, setNumberOfComment] = useState();
  const router = useRouter();
  const Toast = useToast();

  useEffect(() => {
    fetchComments();
  }, []);

  const maxCommentPerPost = 5;

  const fetchComments = async () => {
    try {
      const commentResult = await axiosInstance.get("/comment", {
        params: {
          post_id: data.id,
          _limit: maxCommentPerPost,
          _page: commentPage,
        },
      });

      setComment((prevComments) => [
        ...prevComments,
        ...commentResult.data.result.rows,
      ]);

      setCommentPage(commentPage + 1);
      setNumberOfComment(commentResult.data.result.count);
    } catch (err) {
      console.log(err);
      Toast({
        title: "Fetch Data Failed",
        description: err.response.data.message,
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const addLike = async (post_id, user_id) => {
    try {
      await axiosInstance.post(`/post/${post_id}/likes/${user_id}`);

      let newArr = { ...data };
      newArr.like_count++;
      setData(newArr);
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async (post_id, user_id) => {
    try {
      await axiosInstance.delete(`/post/${post_id}/likes/${user_id}`);

      let newArr = { ...data };
      newArr.like_count--;
      setData(newArr);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteData = (id) => {
    let confirmDelete = window.confirm("Delete the post?");

    if (confirmDelete) {
      axiosInstance.delete(`/post/${id}`).then(() => {
        router.push("/home-page");
      });
    }
  };

  let like_status;

  if (data?.post_like?.length) {
    like_status = true;
  } else {
    like_status = false;
  }

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
          <ContentCard
            username={data?.user_posts?.username}
            location={data?.location}
            likes={data?.like_count || 0}
            caption={data?.caption}
            likeStatus={like_status}
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
            post_comments={comment}
            date={data?.createdAt}
            seeMoreCommentButtonHandler={fetchComments}
            commentPage={commentPage}
            numberOfPageForComment={Math.ceil(
              numberOfComment / maxCommentPerPost
            )}
          />
        )}
      </div>
      <Center>
        <Box mb={4}>
          <Text fontWeight="medium">Share this to your friends!</Text>
          <Stack mt={2} direction="row">
            <FacebookShareButton url={`${WEB_URL}${router.asPath}`} quote={``}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <TwitterShareButton title={``} url={`${WEB_URL}${router.asPath}`}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <WhatsappShareButton
              url={`${WEB_URL}${router.asPath}`}
              title={``}
              separator={``}
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

export const getServerSideProps = requiresAuth(async (context) => {
  console.log(context.req.cookies.auth_token);
  try {
    const res = await axios.get(`http://localhost:2000/post`, {
      params: {
        id: context.query.contentDetail,
      },
      headers: {
        Authorization: context.req.cookies.auth_token,
      },
    });

    const data = res.data.result.rows[0];
    return {
      props: {
        detailPostData: data,
      },
    };
  } catch (err) {
    console.log(err.response.data);
    return {
      props: {
        detailPostData: null,
      },
    };
  }
});

export default ContentDetail;

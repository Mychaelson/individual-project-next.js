import axios from "axios";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import ContentCard from "../../components/ContentCard";
import { Spinner, Center, useToast } from "@chakra-ui/react";
import axiosInstance from "../../config/api";
import Page from "../../components/Page";
import { useRouter } from "next/router";
import requiresAuth from "../../config/requireAuth";

let post_id;

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

  const refreshPage = () => {
    window.location.reload(false);
  };

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

      // let comments = [...comment];
      // comments = comments.concat(commentResult.data.result.rows);
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

  return (
    <Page>
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
    console.log(data);
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

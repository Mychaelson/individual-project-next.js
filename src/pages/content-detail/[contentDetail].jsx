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
  const router = useRouter();
  const Toast = useToast();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const commentResult = await axiosInstance.get("/comment", {
        params: {
          post_id: data.id,
        },
      });

      setComment(commentResult.data.result.rows);
    } catch (err) {
      console.log(err);
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

  const changeLikeStatus = (id, oneClick = false, idx) => {
    if (!data.likeStatus && oneClick) {
      let likesIncrement = data.likes + 1;
      axiosInstance
        .patch(`/contents/${id}`, {
          likes: likesIncrement,
          likeStatus: !data.likeStatus,
        })
        .then(() => {
          let newObj = { ...data };
          newObj.likes++;
          newObj.likeStatus = !newObj.likeStatus;
          setData(newObj);
        });
    } else if (data.likeStatus && oneClick) {
      let likesDecrement = data.likes - 1;
      axiosInstance
        .patch(`/contents/${id}`, {
          likes: likesDecrement,
          likeStatus: !data,
        })
        .then(() => {
          let newObj = { ...data };
          newObj.likes--;
          newObj.likeStatus = !newObj.likeStatus;
          setData(newObj);
        });
    } else if (!data.likeStatus) {
      let likesIncrement = data.likes + 1;
      axiosInstance
        .patch(`/contents/${id}`, {
          likes: likesIncrement,
          likeStatus: !data.likeStatus,
        })
        .then(() => {
          let newObj = { ...data };
          newObj.likes++;
          newObj.likeStatus = !newObj.likeStatus;
          setData(newObj);
        });
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
            likeStatusFnOnclick={() => changeLikeStatus(data.id, true, 0)}
            likeStatusFnDblclick={() => changeLikeStatus(data.id, false, 0)}
            deleteDataFn={() => deleteData(data.id)}
            imgUrl={data?.image_url}
            id={data?.id}
            userId={data?.user_id}
            userPhotoProfile={data?.user_posts?.avatar_img}
            post_comments={comment}
            date={data?.createdAt}
          />
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps = requiresAuth(async (context) => {
  console.log(context.req.cookies.auth_token);
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
});

export default ContentDetail;

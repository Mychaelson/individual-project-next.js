import axios from "axios";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import ContentCard from "../../components/ContentCard";
import { Spinner, Center } from "@chakra-ui/react";
import { axiosInstance } from "../../config/api";
import Page from "../../components/Page";
import { useRouter } from "next/router";
import requiresAuth from "../../config/requireAuth";

const ContentDetail = ({ detailPostData }) => {
  const [data, setData] = useState(detailPostData);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log(detailPostData);
  }, []);

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

  // TODO: want to redirect to homepage
  const deleteData = (id) => {
    let confirmDelete = window.confirm("Delete the post?");

    if (confirmDelete) {
      axiosInstance.delete(`/contents/${id}`).then(() => {
        router.push("/home-page");
      });
    }
  };

  return (
    <Page>
      <div className="mt-3">
        <Center>{isLoading ? <Spinner size="lg" /> : null}</Center>
        {/* {renderData()} */}
        {isLoading ? null : (
          <ContentCard
            username={data?.user?.username}
            location={data?.location}
            likes={data?.likes || 0}
            date={data?.date}
            caption={data?.caption}
            likeStatus={data?.likeStatus}
            likeStatusFnOnclick={() => changeLikeStatus(data.id, true, 0)}
            likeStatusFnDblclick={() => changeLikeStatus(data.id, false, 0)}
            deleteDataFn={() => deleteData(data.id)}
            imgUrl={data?.imgUrl}
            id={data?.id}
            userId={data?.userId}
            userPhotoProfile={data?.user?.avatar_url}
          />
        )}
      </div>
    </Page>
  );
};

export const getServerSideProps = requiresAuth(async (context) => {
  const res = await axiosInstance.get(
    `/contents/${context.query.contentDetail}?_expand=user`
  );

  const data = res.data;
  return {
    props: {
      detailPostData: data,
    },
  };
});

export default ContentDetail;

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
  // const params = useParams();
  const router = useRouter();

  // const fetchData = () => {
  //   // const id = params.contentId;
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     axiosInstance
  //       .get(`/contents?_expand=user&id=${router.query.contentDetail}`)
  //       .then((res) => {
  //         setData(res.data);
  //         setIsLoading(false);
  //       });
  //   }, 1500);
  // };

  // useEffect(() => {
  //   if (router.isReady) {
  //     fetchData();
  //     console.log(data);
  //   }
  // }, [router.isReady]);

  // const renderData = () => {
  //   return data.map((val, idx) => {
  //     return (

  //     );
  //   });
  // };

  useEffect(() => {
    console.log(detailPostData);
  }, []);

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

  // TODO: want to redirect to homepage
  const deleteData = (id) => {
    let confirmDelete = window.confirm("Delete the post?");

    if (confirmDelete) {
      axios.delete(`http://localhost:4000/contents/${id}`).then(() => {
        fetchData();
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

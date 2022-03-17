import axios from "axios";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import ContentCard from "../../components/ContentCard";
import { Spinner, Center } from "@chakra-ui/react";
import { axiosInstance } from "../../config/api";
import Page from "../../components/Page";
import { useRouter } from "next/router";
import requiresAuth from "../../config/requireAuth";

const ContentDetail = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const params = useParams();
  const router = useRouter();

  const fetchData = () => {
    // const id = params.contentId;
    setIsLoading(true);
    setTimeout(() => {
      axiosInstance
        .get(`/contents?_expand=user&id=${router.query.contentDetail}`)
        .then((res) => {
          setData(res.data);
          setIsLoading(false);
        });
    }, 1500);
  };

  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  // const renderData = () => {
  //   return data.map((val, idx) => {
  //     return (

  //     );
  //   });
  // };

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
        <ContentCard
          username={data[0]?.user?.username}
          location={data[0]?.location}
          likes={data[0]?.likes || 0}
          date={data[0]?.date}
          caption={data[0]?.caption}
          likeStatus={data[0]?.likeStatus}
          likeStatusFnOnclick={() => changeLikeStatus(data[0].id, true, 0)}
          likeStatusFnDblclick={() => changeLikeStatus(data[0].id, false, 0)}
          deleteDataFn={() => deleteData(data[0].id)}
          imgUrl={data[0]?.imgUrl}
          id={data[0]?.id}
          userId={data[0]?.userId}
          userPhotoProfile={data[0]?.user?.avatar_url}
        />
      </div>
    </Page>
  );
};

export const getServerSideProps = requiresAuth((context) => {
  return {
    props: {},
  };
});

export default ContentDetail;

import axiosInstance from "../../config/api";
import posts_types from "../reducers/posts/types";

export const fetchContents = (page) => {
  return async (dispatch) => {
    try {
      const res = await axiosInstance.get("/post", {
        params: {
          _limit: 5,
          _page: page,
          _sortBy: "createdAt",
          _sortDir: "DESC",
        },
      });

      const allPost = res.data.result.rows;

      const fetchType = posts_types.FETCH_POST;

      if (page != 1) {
        fetchType = posts_types.UPDATE_POST;
      }

      dispatch({
        type: fetchType,
        payload: {
          post: allPost,
          count: res.data.result.count,
        },
      });

      console.log(allPost);
    } catch (err) {
      console.log(err);
    }
  };
};

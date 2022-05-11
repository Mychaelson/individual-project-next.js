import posts_types from "./posts/types";

const initital_value = {
  postCount: 0,
  postLists: [],
};

const PostReducers = (state = initital_value, action) => {
  if (action.type == posts_types.UPDATE_POST) {
    return {
      ...state,
      postLists: [...state.postLists, ...action.payload.post],
      postCount: action.payload.count,
    };
  } else if (action.type == posts_types.FETCH_POST) {
    return {
      ...state,
      postLists: [...action.payload.post],
      postCount: action.payload.count,
    };
  } else if (action.type == posts_types.NEW_POST) {
    return {
      ...state,
      postLists: [action.payload, ...state.postLists],
      postCount: state.postCount + 1,
    };
  } else if (action.type == posts_types.LIKE_POST) {
    const posts = [...state.postLists];
    posts.splice(action.payload.idx, 1, action.payload.post);

    return {
      ...state,
      postLists: posts,
    };
  } else if (action.type == posts_types.EDIT_POST) {
    console.log("hei");
    const post = [...state.postLists];
    const selectedPost = post[action.payload.idx];

    selectedPost.comments = [
      {
        comment: action.payload.comment,
        user: { username: action.payload.username },
      },
      ...selectedPost.comments,
    ];

    // if (
    //   selectedPost.comments.length > 5 &&
    //   selectedPost.comments.length % 5 == 0
    // ) {
    //   console.log("test");
    //   selectedPost.comments.splice(-1);
    // }

    return {
      ...state,
      postLists: post,
    };
  }
  return state;
};

export default PostReducers;

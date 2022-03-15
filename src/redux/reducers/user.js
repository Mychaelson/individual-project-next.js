import user_types from "./user/types";

const initital_value = {
  username: "",
  full_name: "",
  email: "",
  id: 0,
  bio: "",
  avatar_url: "",
};

const UserReducer = (state = initital_value, action) => {
  if (action.type === user_types.LOGIN_USER) {
    return {
      ...state,
      username: action?.payload?.username,
      full_name: action?.payload?.full_name,
      email: action?.payload?.email,
      id: action?.payload?.id,
      bio: action?.payload?.bio,
      avatar_url: action?.payload?.avatar_url,
    };
  } else if (action.type === user_types.LOGOUT_USER) {
    return initital_value;
  }

  return state;
};

export default UserReducer;

import {} from "react-redux";
import user_types from "../redux/reducers/user/types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Box, Text } from "@chakra-ui/react";
import Cookies from "js-cookie";

const AuthProvider = ({ children }) => {
  // const [isReloginChecked, setIsReloginChecked] = useState(false);
  const dispatch = useDispatch();

  const authSelector = useSelector((state) => state.user);

  useEffect(() => {
    const savedUserData = Cookies.get("user_data");
    // console.log(savedUserData);

    if (savedUserData) {
      const parsedUserData = JSON.parse(savedUserData);
      dispatch({
        type: user_types.LOGIN_USER,
        payload: parsedUserData,
      });
    }

    // setIsReloginChecked(true);
  }, []);
  return children;
};

export default AuthProvider;

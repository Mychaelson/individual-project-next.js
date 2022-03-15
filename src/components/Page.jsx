import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import user_types from "../redux/reducers/user/types";
import { Box, Text } from "@chakra-ui/react";

const Page = ({ children }) => {
  // ini nanti buat meta tag
  return (
    <>
      <Head>
        <title></title>
      </Head>
      {children}
    </>
  );
};

export default Page;

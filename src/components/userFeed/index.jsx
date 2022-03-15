import { Box, Center, Image } from "@chakra-ui/react";

const Feeds = (props) => {
  return (
    <Image
      boxSize="250px"
      src={props.imgUrl}
      fallbackSrc="https://via.placeholder.com/250"
      m={1}
      className="rounded"
    />
  );
};

export default Feeds;

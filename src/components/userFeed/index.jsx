import { Image } from "@chakra-ui/react";
import Link from "next/link";

const Feeds = (props) => {
  return (
    <Link href={`/content-detail/${props.id}`}>
      <Image
        boxSize="250px"
        src={props.imgUrl}
        fallbackSrc="https://via.placeholder.com/250"
        m={1}
        className="rounded"
      />
    </Link>
  );
};

export default Feeds;

import { Image } from "@chakra-ui/react";
import Link from "next/link";

const Feeds = (props) => {
  return (
    // the image of a post can be click and redirect to the detail of that post based on the id
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

import { Box, Text } from "@chakra-ui/react";

const comments = ({ username, content }) => {
  return (
    <Box>
      <Text fontSize="md" className="fw-bold">
        {username} - <span className="fw-light">{content}</span>
      </Text>
    </Box>
  );
};

export default comments;

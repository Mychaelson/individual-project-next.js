import {
  Avatar,
  Box,
  Center,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { AiOutlineEdit } from "react-icons/ai";

const UserProfile = (props) => {
  const userSelector = useSelector((state) => state.user);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Center>
      <Box display="flex" alignItems="center" mx={5}>
        <Avatar
          size="2xl"
          name="user"
          src={props.avatarUrl}
          marginX={8}
          my={4}
        />
        <Box>
          <Text fontWeight="bold" mb={2} fontSize="3xl">
            {props.fullName}{" "}
            {props.id === userSelector.id ? (
              <Icon
                onClick={onOpen}
                as={AiOutlineEdit}
                boxSize={5}
                className="click"
              />
            ) : null}
          </Text>

          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay>
              <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel htmlFor="fullNameEdit">Full Name</FormLabel>
                    <Input id="fullNameEdit" type="text" />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="usernameEdit">Username</FormLabel>
                    <Input id="usernameEdit" type="text" />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="bioEdit">Bio</FormLabel>
                    <Textarea id="bioEdit" type="text" />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="profilePictureEdit">
                      Profile Picture Url
                    </FormLabel>
                    <Input id="profilePictureEdit" type="text" />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button variant="outline" me={2} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="teal">Save</Button>
                </ModalFooter>
              </ModalContent>
            </ModalOverlay>
          </Modal>

          <Text fontSize="md">
            {props.posting} {props.posting > 1 ? "posts" : "post"}
          </Text>
          <Text color="gray.500" my={2}>
            {props.bio}
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default UserProfile;

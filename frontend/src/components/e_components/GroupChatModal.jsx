import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserItem from './UserItem';
import UserList from './UserList';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
  
    const { user, chats, setChats } = ChatState();
    const handleSearch = async(query)=>{
        setSearch(query);
        if(!query)
        {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                  Authorization: `Bearer ${user.data.token}`,
                },
              };
              const {data}=await axios.get(`/api/user?search=${search}`,config);
              console.log(data);
              setLoading(false)
              setSearchResult(data);

        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom",
              });
        }


    }
    const handleSubmit=async ()=>{
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/chat/group`,
          {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
      

    }
    const handleDelete=(d)=>{
      setSelectedUsers(selectedUsers.filter(sel=>sel._id!==d._id))

    }
    const handleGroup=(u)=>{
        if (selectedUsers.includes(u)) {
            toast({
              title: "User already added",
              status: "warning",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            return;
          }
      
          setSelectedUsers([...selectedUsers, u]);

    }
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} d='flex' justifycontent='center'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center">
              Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
          <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
             <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserItem
                  key={u._id}
                  u={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((u) => (
                  <UserList
                    key={u._id}
                    u={u}
                    handleFunction={() => handleGroup(u)}
                  />
                ))
            )} 
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
             Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserList from "./UserList";

function SideDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const history = useHistory();
  const toast = useToast();
  
 //const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { user,selectedChat,setSelectedChat,chats,setChats} = ChatState();
  
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    toast({
      title: "Logout user",
      status: "info",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };
 //console.log(searchResult)
  const handleSearch = async() => {
    if(!search)
    {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      // setLoading(false);
    }
  };
  const accessChat= async (userId) => {
    //console.log(userId)
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      // console.log(userId)
      const { data } = await axios.post("/api/chat",{ userId }, config);
      // console.log(data);
      // console.log(chats)
      if (!chats.find((c) => c._id === data._id))
      setChats([data, ...chats]);
      setSelectedChat(data);
      console.log("helllo");
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="work sans">
          Talk Master
        </Text>
        <div>
          <Menu>
            <MenuButton p="1">
              <BellIcon fontSize="2xl" />
            </MenuButton>
            <MenuList></MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={"sm"} cursor="pointer" />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb="2">
              <Input
                placeholder="Search by name or email"
                mr="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
             {
              loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map(u =>
                  <UserList
                  key={u._id}
                  u={u}
                  handleFunction={()=>accessChat(u._id)}
                  />)
              )
            }
            {loadingChat && <Spinner ml='auto' d='flex' />} 
          </DrawerBody>
          
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;

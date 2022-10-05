import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useHistory } from "react-router";

const Signup = () => {
  const history=useHistory()
  const [show, setShow] = useState(false)
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [cpassword, setCpassword] = useState();
  const [dp, setDp] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast()
 
  const handleClick = () => setShow(!show);
  const postDetails=(pics)=>{
  setLoading(true);
  if(pics===undefined)
  {
    toast({
      title: 'Please Select an Image',
      status: 'warning',
      duration: 5000,
      isClosable: true,
      position: "bottom",
    })
    return;
  }
  if(pics.type==="image/jpeg" || pics.type==="image/png" )
  {
    const data=new FormData();
    data.append("file",pics);
    data.append("upload_preset","Chat_App");
    data.append("cloud_name","dmz6ghxq8");
    fetch("https://api.cloudinary.com/v1_1/dmz6ghxq8/image/upload",{method:'post',body:data,}).then((res)=> res.json()).then((data)=>{
      setDp(data.url.toString());
      console.log(data.url.toString());
      setLoading(false);
    }).catch((err)=>{
      console.log(err);
      setLoading(false);
    })

  }
  else{
    toast({
      title: 'Please Select an Image',
      status: 'warning',
      duration: 1000,
      isClosable: true,
      position: "bottom"
    });
    setLoading(false);
    return;
  }
  }


  const handleSubmit= async() => {
    setLoading(true);
    if (!name || !email || !password || !cpassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== cpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const data=await axios.post("/api/user",{
        name,email,password,dp
      },config);

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chat");

    }
    catch(error)
    {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }

  }
  return (
    <VStack spacing={"5px"}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e)=>setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="cpassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e)=>setCpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="dp" isRequired>
        <FormLabel>Upload profile Image</FormLabel>
        <Input
        type={"file"}
          placeholder="upload image"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button colorScheme='cyan' variant='outline' onClick={handleSubmit} isLoading={loading}>
          SignUp
      </Button>
    </VStack>
  );
};

export default Signup;

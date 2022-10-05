import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router";


const Login = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history=useHistory();
    const handleClick = () => setShow(!show);

    const handleSubmit= async (e) => {
      // e.preventDefault();
      setLoading(true);

      if(!email || !password)
      {
        toast({
          title: "Please fill all the field",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
      try { 
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

      const data= await axios.post("/api/user/login",{
        email,password
      },config);
      console.log(data);
      toast({
        title: "Login Successful",
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
        <FormControl id="lemail" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="lpassword" isRequired>
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
        <Button colorScheme='cyan' variant='outline' onClick={handleSubmit} isLoading={loading}>
            Login
        </Button>
      </VStack>
    );
}
export default Login
import React from 'react';
import {
    Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure
  } from '@chakra-ui/react'

function ProfileModel({user,children})

 {
   //console.log(user)
  // console.log(children);
  //const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const { isOpen, onOpen, onClose } = useDisclosure();
      return (
        <>
        {
            <span onClick={onOpen}>{children}</span>
               
        }
        <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
          fontSize='25px'
          fontFamily='Work sans'
          d='flex'
          justifyContent='center'
          >
            {user?.data.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
          d="flex"
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          >
              <Image
              borderRadius='full'
              boxSize='150px'
              src={user?.data.dp}
              alt={user?.data.name}
               />
              <Text margin='5px 0'>
                Email: {user?.data.email}
              </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default ProfileModel
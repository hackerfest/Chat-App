import React from 'react';
import {
    Button,
    IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';

function ReceiverProfile({user})
 {
  //  console.log(user)
  // console.log(children);

    const { isOpen, onOpen, onClose } = useDisclosure();
      return (
        <>
        {
                <IconButton 
                d={{base:"flex"}}
                icon={<ViewIcon/>}
                onClick={onOpen} />
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
            {user.name}</ModalHeader>
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
              src={user.dp}
              alt={user.name}
               />
              <Text margin='5px 0'>
                Email: {user.email}
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

export default ReceiverProfile
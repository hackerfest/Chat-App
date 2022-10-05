import { Box} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import React from 'react'

const UserItem = ({u,handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius='lg'
    m={1}
    mb={2}
    variant='solid'
    bg='yellow'
    cursor='pointer'
    onClick={handleFunction}>
      {u.name}
      <CloseIcon ml={2} fontSize='13'/>
    </Box>
  )
}

export default UserItem
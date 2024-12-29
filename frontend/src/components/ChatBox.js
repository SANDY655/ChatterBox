import React from 'react';
import { Box, Paper } from '@mui/material';
import SingleChat from './SingleChat';
import { ChatState } from '../Context/ChatProvider';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ xs: selectedChat ? 'flex' : 'none', md: 'flex' }}
      flexDirection="column"
      p={2}
      bgcolor="background.paper"
      width={{ xs: '1000%', md: '70%' }}
      borderRadius="16px"
      boxShadow={3}
      
    >
      
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      
    </Box>
  );
};

export default ChatBox;
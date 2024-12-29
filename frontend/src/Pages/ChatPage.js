import React, { useState } from 'react';
import { Box } from '@mui/material';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import ChatBox from '../components/ChatBox';
import MyChats from '../components/MyChats';
import { ChatState } from '../Context/ChatProvider';

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer />}

      <Box
        sx={{
          display: 'flex',
          justifyContent:"space-between",
          gap:"10px",
          height:"91.5vh",
          padding:"10px"
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    
    </div>
  );
};

export default ChatPage;

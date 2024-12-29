import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import { Box, Button, Stack, Typography, Avatar } from '@mui/material';
import { Add } from '@mui/icons-material';
import { getSender, getLatestMessage, getSenderAvatar } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      setChats(data);  // Make sure the chats contain messages
    } catch (error) {
      alert('Error Occurred!');
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  if (!loggedUser) {
    return <Typography>Loading chats...</Typography>;
  }

  return (
    <Box
      sx={{
        display: { xs: selectedChat ? 'none' : 'flex', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        bgcolor: 'white',
        width: { xs: '100%', md: '31%' },
        borderRadius: '8px',
        border: '1px solid #ccc',
        boxShadow: 3,
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          pb: 3,
          px: 3,
          fontSize: { xs: '20px', md: '28px' },
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          color: '#3f51b5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        My Chats
        <GroupChatModal>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#3f51b5',
              color: 'white',
              fontFamily: 'Roboto, sans-serif',
              '&:hover': { bgcolor: '#303f9f' },
            }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {/* Chat List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          bgcolor: '#f8f8f8',
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          overflowY: 'auto',
        }}
      >
        {chats ? (
          <Stack spacing={2}>
            {chats.map((chat) => {
              const latestMessage = getLatestMessage(chat);  // Get the latest message
              return (
                <Button
                  onClick={() => setSelectedChat(chat)}
                  key={chat._id}
                  sx={{
                    justifyContent: 'flex-start',
                    bgcolor: selectedChat === chat ? '#3f51b5' : '#e8e8e8',
                    color: selectedChat === chat ? 'white' : '#333',
                    px: 3,
                    py: 1.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontFamily: 'Roboto, sans-serif',
                    '&:hover': {
                      bgcolor: selectedChat === chat ? '#303f9f' : '#ddd',
                    },
                  }}
                >
                  <Avatar
                    alt={chat.isGroupChat ? chat.chatName : getSender(loggedUser, chat.users)}
                    src={getSenderAvatar(loggedUser, chat.users)}
                    sx={{ marginRight: 2 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: selectedChat === chat ? 'white' : 'inherit',
                      }}
                    >
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Typography>
                    
                  </Box>
                </Button>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

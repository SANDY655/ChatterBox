import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Lottie  from 'react-lottie'
import axios from 'axios';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import { getSenderFull, getSender } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import { ChatState } from '../Context/ChatProvider';
import ArrowBack from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send'; // Send Icon
import './styles.css';
import io from 'socket.io-client'
import animationData from '../animations/typing.json'
const ENDPOINT="http://localhost:5000";
var socket,selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const[socketConnected,setSocketConnected]=useState(false);
  const[typing,setTyping]=useState(false);
  const[isTyping,setIsTyping]=useState(false);
  const defaultOptions={
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings:{
      preserveAspectRatio:"xMidYMid slice"
    }
  }

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat',selectedChat._id);
    } catch (error) {
      alert('Failed to load messages');
    }
  };
  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup",user);
    socket.on('connected',()=>{setSocketConnected(true)})
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
  },[])
  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat
  }, [selectedChat]);
  useEffect(()=>{
    socket.on("message received",(newMessageReceived)=>{
      if(!selectedChatCompare||selectedChatCompare._id!==newMessageReceived.chat._id)
      {
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived,...notification])
          setFetchAgain(!fetchAgain);
        }

        
      }
      else{
        setMessages([...messages,newMessageReceived])
      }
    })
  })
  const sendMessage = async (event) => {
    if ((event.type === 'click' || event.key === 'Enter') && newMessage) {
      socket.emit("stop typing",selectedChat._id)
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message",data)
        setMessages([...messages, data]);
        setNewMessage('');
      } catch (error) {
        alert('Error occurred');
      }
    }
  };


  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  
    if (!socketConnected) return;
  
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
  
    const lastTypingTime = new Date().getTime(); // Save the initial typing time
    const timerLength = 3000;
  
    setTimeout(() => {
      const timeNow = new Date().getTime(); // Get the current time
      const timeDiff = timeNow - lastTypingTime;
  
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  

  return (
    <>
      {selectedChat ? (
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(90deg, #3a7bd5, #00d2ff)',
              padding: 1,
              color: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton onClick={() => setSelectedChat('')} sx={{ color: '#fff' }}>
                <ArrowBack />
              </IconButton>
              <Typography variant="h6">
                {selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : getSender(user, selectedChat.users)}
              </Typography>
            </Box>
            <Box>
              {!selectedChat.isGroupChat ? (
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              )}
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: '#f4f5f7',
              padding: 2,
              overflowY: 'auto',
            }}
          >
            {loading ? (
              <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {isTyping?(<div><Lottie width={70}
                options={defaultOptions}
                style={{marginLeft:0,marginBottom:15}}/></div>):(<></>)}
              </div>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: 2,
              borderTop: '1px solid #e0e0e0',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
              InputProps={{
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  paddingLeft: 2,
                },
              }}
            />
            {/* Send Button/Icon */}
            <IconButton
              onClick={sendMessage}
              sx={{
                color: newMessage ? '#0078FF' : '#B0BEC5', // Change color when text is typed
                padding: 0,
                marginLeft: 1,
              }}
              disabled={!newMessage} // Disable if message is empty
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            backgroundColor: '#f0f4f8',
            borderRadius: 2,
            padding: 3,
          }}
        >
          <Typography color="textSecondary" variant="h6">
            Click on a user to start chatting.
          </Typography>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

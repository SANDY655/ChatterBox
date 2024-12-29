import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { Box, Avatar, Tooltip, Typography } from '@mui/material';
import { ChatState } from '../Context/ChatProvider';
import { isSameUser } from '../config/ChatLogics';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Box
            key={m._id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.sender._id === user._id ? 'flex-end' : 'flex-start',
              marginTop: i !== 0 && !isSameUser(messages, m, i) ? 2 : 1,  // Space between different users' messages
              paddingX: 1.5,
            }}
          >
            {/* Display Date only when it's the first message from a new date group */}
            {i === 0 || formatMessageDate(m.createdAt) !== formatMessageDate(messages[i - 1].createdAt) ? (
              <Box
                sx={{
                  width: '100%',  // Make sure the date container spans the full width
                  display: 'flex',
                  justifyContent: 'center',  // Center the date horizontally
                  marginY: 1,  // Vertical space around the date
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',  // Lighter gray for the date text
                    fontSize: '0.75rem',  // Smaller font size like WhatsApp
                    textAlign: 'center',  // Center text
                    backgroundColor: '#f0f0f0',  // Soft background for the date text
                    padding: '4px 8px',  // Padding for clarity, not too large
                    borderRadius: '10px',  // Soft rounded corners
                  }}
                >
                  {formatMessageDate(m.createdAt)}
                </Typography>
              </Box>
            ) : null}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flexDirection: m.sender._id === user._id ? 'row-reverse' : 'row',
              }}
            >
              <Tooltip title={m.sender.name} placement="bottom-start" arrow>
                <Avatar
                  sx={{
                    width: 45,
                    height: 45,
                    marginRight: m.sender._id === user._id ? 0 : 1,
                    marginLeft: m.sender._id === user._id ? 1 : 0,
                  }}
                  alt={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
              <Box
                sx={{
                  background: m.sender._id === user._id
                    ? 'rgba(0, 128, 255, 0.1)'  // Light blue with slight transparency for sender
                    : 'white',  // Light orange with slight transparency for receiver
                  borderRadius: m.sender._id === user._id
                    ? '10px 10px 0px 10px'
                    : '10px 10px 10px 0px',
                  padding: '10px 15px',
                  maxWidth: '100%',  // Ensure message does not exceed available space
                  wordBreak: 'break-word', // Break long words to avoid overflow
                  whiteSpace: 'normal',  // Allow text to wrap normally
                  overflowWrap: 'break-word', // Prevent overflow of long words
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '0.9rem',  // Standard font size for readability
                    lineHeight: 1.4,
                    color: m.sender._id === user._id ? '#000' : '#333',  // Darker text color
                  }}
                >
                  {m.content}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'gray',
                    fontSize: '0.75rem',
                    display: 'block',
                    marginTop: 0.5,
                    textAlign: 'right',
                  }}
                >
                  {formatDateTime(m.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

import React from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="30px" // Slightly rounded for smoother look
      m={1}
      mb={2}
      fontSize={14}
      bgcolor="#2196F3" // Light Blue background
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for a floating effect
        '&:hover': {
          transform: 'scale(1.05)',
          bgcolor: '#1976D2', // Darker blue on hover
          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)', // Shadow effect on hover
        },
      }}
      onClick={handleFunction}
    >
      <span style={{ fontWeight: '600', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {user.name}
      </span>
      <CloseIcon
        sx={{
          color: 'white',
          ml: 1,
          transition: 'color 0.2s ease',
          '&:hover': {
            color: '#FFEB3B', // Yellow hover color for the icon
            cursor: 'pointer',
            transform: 'scale(1.2)', // Slight zoom on hover
          },
        }}
      />
    </Box>
  );
};

export default UserBadgeItem;

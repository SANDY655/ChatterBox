import React from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';

const ChatLoading = () => (
  <Box p={2} width="100%">
    <Typography variant="h6" mb={2}>Loading Users...</Typography>
    <Stack spacing={2}>
      {Array.from(new Array(5)).map((_, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          gap={2}
          p={1}
          sx={{
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Box flexGrow={1}>
            <Skeleton variant="text" width="80%" height={20} />
            <Skeleton variant="text" width="60%" height={16} />
          </Box>
        </Box>
      ))}
    </Stack>
  </Box>
);

export default ChatLoading;

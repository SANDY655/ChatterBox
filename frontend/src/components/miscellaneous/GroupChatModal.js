import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { ChatState } from '../../Context/ChatProvider';
import { FormControl, IconButton, Input } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; // Import Alert for styled notifications

const GroupChatModal = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(''); // State for Snackbar message
    const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Severity (info, success, error, etc.)

    const { user, chats, setChats } = ChatState();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setSnackbarMessage("Error occurred during search");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            
        }
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            setSnackbarMessage("Please fill all fields");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                "/api/chat/group",
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            setSnackbarMessage("New Group Chat created");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            setSnackbarMessage("Error occurred while creating group chat");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            setSnackbarMessage("User already added");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <span onClick={handleOpen}>{children}</span>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6">
                        Create Group Chat
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Input
                            placeholder="Chat Name"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Input
                            placeholder="Add Users"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>
                    <Box width="100%" display="flex" flexWrap="wrap">
                        {selectedUsers.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleDelete(u)}
                            />
                        ))}
                    </Box>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        searchResult?.slice(0, 4).map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleGroup(user)}
                            />
                        ))
                    )}
                    <Box sx={{ mt: 3,display:'flex', justifyContent:'center' }}>
                    <Button 
    variant="contained" 
    onClick={handleSubmit} 
    sx={{
        bgcolor: '#4CAF50',  // Success Green
        color: 'white', 
        '&:hover': {
            bgcolor: '#45a049',  // Slightly darker green for hover effect
        },
    }}
>
    Create Chat
</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Snackbar for showing notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default GroupChatModal;

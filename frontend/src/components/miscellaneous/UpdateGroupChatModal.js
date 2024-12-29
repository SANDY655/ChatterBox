import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, Input, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            handleSnackbar("Only the admin can remove someone", 'error');
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupremove`,
                { chatId: selectedChat._id, userId: user1._id },
                config
            );
            if (user1._id === user._id) {
                setSelectedChat();
            } else {
                setSelectedChat(data);
            }
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
            handleSnackbar("User removed successfully");
        } catch (error) {
            handleSnackbar("Error occurred while removing the user", 'error');
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                { chatId: selectedChat._id, chatName: groupChatName },
                config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            setGroupChatName('');
            handleSnackbar("Group name updated successfully");
        } catch (error) {
            handleSnackbar("Error occurred while renaming the group", 'error');
            setRenameLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            handleSnackbar("Error occurred during search", 'error');
            setLoading(false);
        }
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            handleSnackbar("User is already in the group!", 'info');
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            handleSnackbar("Only the admin can add someone", 'error');
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                { chatId: selectedChat._id, userId: user1._id },
                config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            handleSnackbar("User added successfully");
        } catch (error) {
            handleSnackbar("Error occurred while adding the user", 'error');
            setLoading(false);
        }
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        bgcolor: 'background.paper',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
        position: 'relative',
    };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <VisibilityIcon />
            </IconButton>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
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
                    <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
                        {selectedChat.chatName}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        {selectedChat.users.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleRemove(u)}
                            />
                        ))}
                    </Box>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Input
                            placeholder="Chat Name"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            disabled={renameLoading}
                            onClick={handleRename}
                            sx={{ mt: 1 }}
                        >
                            {renameLoading ? <CircularProgress size={20} /> : "Update"}
                        </Button>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Input
                            placeholder="Add user to group"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemove(user)}
                        sx={{ mt: 2 }}
                    >
                        Leave Group
                    </Button>
                </Box>
            </Modal>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UpdateGroupChatModal;

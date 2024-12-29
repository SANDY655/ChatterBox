import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Badge,
  MenuItem,
  Avatar,
  Menu,
  Drawer,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false); // New state to control notification menu visibility
  const history = useHistory();
  const { user, selectedChat, setSelectedChat, notification, setNotification, chats, setChats } = ChatState();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");

    setOpenSnackbar(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const handleSearch = async () => {
    if (!search) {
      setSnackbarMessage("Please enter something to search.");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setSnackbarMessage("Error fetching the chat.");
      setOpenSnackbar(true);
    }
  };

  const toggleNotificationMenu = () => {
    setNotificationMenuOpen((prev) => !prev); // Toggle the notification menu visibility
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#f9f9f9"
        padding="10px 20px"
        borderBottom="1px solid #e0e0e0"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <Tooltip title="Search Users to Chat" arrow>
          <Button
            variant="text"
            startIcon={<i className="fas fa-search" style={{ fontSize: "1.2rem", color: "#555" }} />}
            sx={{
              textTransform: "none",
              color: "#3f51b5",
              fontFamily: "Roboto, sans-serif",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <Typography
              variant="body1" color="black"
              sx={{ display: { xs: "none", md: "block" }, fontFamily: "Roboto, sans-serif" }}
            >
              Search User
            </Typography>
          </Button>
        </Tooltip>

        <Typography
          variant="h5"
          fontFamily="Roboto, sans-serif"
          fontWeight="bold"
          color="#3f51b5"
        >
          ChatterBox
        </Typography>

        <Box display="flex" alignItems="center" gap={3}>
          <Tooltip title="Notifications" arrow>
            <IconButton
              aria-label="notifications"
              onClick={toggleNotificationMenu} // Toggle the notification menu
            >
              <Badge badgeContent={notification.length} color="error">
                <NotificationsIcon sx={{ color: "#3f51b5" }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notificationMenuOpen ? document.body : null} // If the menu is open, render it
            open={notificationMenuOpen}
            onClose={toggleNotificationMenu} // Close the menu when clicking outside
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {!notification.length && <MenuItem>No New Messages</MenuItem>}
            {notification.map((notif) => (
              <MenuItem key={notif._id} onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
                toggleNotificationMenu(); // Close menu when a notification is clicked
              }}>
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </Menu>

          <Tooltip title={user.name} arrow>
            <Avatar
              src={user.pic}
              alt={user.name}
              sx={{
                cursor: "pointer",
                width: 40,
                height: 40,
                border: "2px solid #3f51b5",
                "&:hover": { boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" },
              }}
            />
          </Tooltip>

          <Tooltip title="Profile Options" arrow>
            <IconButton
              onClick={handleMenuOpen}
              aria-controls={open ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                color: "#3f51b5",
                "&:hover": { color: "#303f9f" },
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiMenu-paper": {
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <ProfileModel user={user}>
          <MenuItem sx={{ fontFamily: "Roboto, sans-serif" }}>Profile</MenuItem>
        </ProfileModel>
        <MenuItem onClick={logoutHandler} sx={{ fontFamily: "Roboto, sans-serif" }}>
          Logout
        </MenuItem>
      </Menu>

      <Drawer anchor="left" open={drawerOpen} onClose={onClose}>
        <Box width={300} p={2} role="presentation">
          <Typography variant="h6" mb={2} fontFamily="Roboto, sans-serif">
            Search Users
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <TextField
              placeholder="Type to search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0px",
                  backgroundColor: "#f5f5f5",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#3f51b5",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#303f9f",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                background: "linear-gradient(135deg, #3f51b5, #303f9f)",
                color: "#fff",
                borderRadius: "0px",
                fontWeight: "bold",
                padding: "10px 20px",
                fontFamily: "Roboto, sans-serif",
                boxShadow: "0 4px 8px rgba(63, 81, 181, 0.4)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(135deg, #303f9f, #3f51b5)",
                  transform: "scale(1.05)",
                },
              }}
              onClick={handleSearch}
            >
              Go
            </Button>
          </Box>
          {loading ? (
            <CircularProgress />
          ) : (
            searchResult?.map((user) => (
              <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
            ))
          )}
          {loadingChat && <CircularProgress />}
        </Box>
      </Drawer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SideDrawer;

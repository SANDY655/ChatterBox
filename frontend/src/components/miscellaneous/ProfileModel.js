import React from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #e0e0e0", // Adjusted border color
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "10px",
};

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <IconButton onClick={handleOpen}>
          <Visibility />
        </IconButton>
      )}
      <Modal open={open} onClose={handleClose} aria-labelledby="profile-modal">
        <Box sx={style}>
          <Typography
            id="profile-modal"
            variant="h4"
            component="h2"
            sx={{
              fontFamily: "Roboto, sans-serif", // Font from SideDrawer
              textAlign: "center",
              color: "#3f51b5", // Text color from SideDrawer
              fontWeight: "bold",
            }}
          >
            {user.name}
          </Typography>
          <Avatar
            alt={user.name}
            src={user.pic}
            sx={{ width: 150, height: 150, marginY: 2 }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: "18px",
              fontFamily: "Roboto, sans-serif", // Font from SideDrawer
              color: "#555", // Text color from SideDrawer
            }}
          >
            Email: {user.email}
          </Typography>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #3f51b5, #303f9f)", // Gradient from SideDrawer
              color: "#fff",
              borderRadius: "30px", // Rounded corners from SideDrawer
              fontWeight: "bold",
              padding: "10px 20px",
              fontFamily: "Roboto, sans-serif", // Font from SideDrawer
              boxShadow: "0 4px 8px rgba(63, 81, 181, 0.4)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                background: "linear-gradient(135deg, #303f9f, #3f51b5)",
                transform: "scale(1.05)",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileModal;

import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        color: "#333",
        padding: "10px 15px",
        marginBottom: "10px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          backgroundColor: "#3f51b5", // Top bar color
          color: "white",
          transform: "translateY(-3px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        },
        "@media (max-width: 600px)": {
          padding: "8px 12px",
          marginBottom: "8px",
        },
      }}
    >
      {/* Avatar Section */}
      <Avatar
        src={user.pic}
        alt={user.name}
        sx={{
          width: 40,
          height: 40,
          marginRight: "15px",
          border: "2px solid #e0e0e0",
          "@media (max-width: 600px)": {
            width: 35,
            height: 35,
            marginRight: "10px",
          },
        }}
      />

      {/* User Info Section */}
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: "4px",
            color: "inherit",
            "@media (max-width: 600px)": {
              fontSize: "0.9rem",
            },
          }}
        >
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.85rem",
            color: "inherit",
            "@media (max-width: 600px)": {
              fontSize: "0.8rem",
            },
          }}
        >
          <b>Email:</b> {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;

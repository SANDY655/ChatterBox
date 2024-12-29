import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Container,
} from "@mui/material";

function Homepage() {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history.push("/chats");
  }, [history]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Title */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: "100%",
          maxWidth: 500,
          marginBottom: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontFamily: "'Work Sans', sans-serif", color: "#2d3748" }}
        >
          ChatterBox        </Typography>
      </Paper>

      {/* Tabs */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ marginTop: 2 }}>
          {activeTab === "login" && <Login />}
          {activeTab === "signup" && <Signup />}
        </Box>
      </Paper>
    </Container>
  );
}

export default Homepage;

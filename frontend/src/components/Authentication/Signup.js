import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import emailjs from "emailjs-com";
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClickShowPassword = () => setShow(!show);
  const history = useHistory();

  const [ver, setVer] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [giveotp, setGiveOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      setNotification({
        open: true,
        message: "Please fill all the fields!",
        severity: "error",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      setNotification({
        open: true,
        message: "Passwords do not match!",
        severity: "error",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );
      setNotification({
        open: true,
        message: "Registration Successful!",
        severity: "success",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      setNotification({
        open: true,
        message: `Error: ${error.response?.data?.message || "Something went wrong"}`,
        severity: "error",
      });
      setPicLoading(false);
    }
  };

  const generateOTP = () => {
    const sentotp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    setVer(sentotp);
    setOtpSent(true);
    emailjs
      .send(
        "service_cap4jbe",
        "template_rambtaw",
        {
          otp: sentotp,
          reply_to: email,
        },
        "BzP556Kw_bPFAf_MV"
      )
      .then(() => {
        setNotification({
          open: true,
          message: "OTP sent successfully!",
          severity: "success",
        });
      })
      .catch(() => {
        setNotification({
          open: true,
          message: "Failed to send OTP. Try again later.",
          severity: "error",
        });
      });
  };

  const handleverify = () => {
    if (parseInt(giveotp) === ver) {
      setEmailVerified(true);
      setNotification({
        open: true,
        message: "Email Verified Successfully!",
        severity: "success",
      });
    } else {
      setNotification({
        open: true,
        message: "Invalid OTP! Please try again.",
        severity: "error",
      });
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    setUploadProgress(0);

    if (pics === undefined) {
      setNotification({
        open: true,
        message: "Please select an image!",
        severity: "error",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Chat App");
      data.append("cloud_name", "drpjqptqc");

      fetch("https://api.cloudinary.com/v1_1/drpjqptqc/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setUploadProgress(100);
          setPicLoading(false);
          setImageUploaded(true);
        })
        .catch(() => {
          setNotification({
            open: true,
            message: "Image upload failed!",
            severity: "error",
          });
          setPicLoading(false);
        });

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress >= 90) {
          clearInterval(interval);
        } else {
          setUploadProgress(progress);
        }
      }, 200);
    } else {
      setNotification({
        open: true,
        message: "Please select a valid image format (JPEG/PNG)!",
        severity: "error",
      });
      setPicLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="400px"
      margin="0 auto"
      padding="20px"
      borderRadius="8px"
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
    >
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email Address"
        type="email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={emailVerified}
      />
      {!emailVerified && (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={generateOTP}
            disabled={otpSent}
            sx={{ mt: 1 }}
          >
            {otpSent ? "OTP Sent" : "Send OTP"}
          </Button>
          <TextField
            label="Enter OTP"
            value={giveotp}
            onChange={(e) => setGiveOtp(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleverify}
            sx={{ mt: 1 }}
          >
            Verify OTP
          </Button>
        </>
      )}

      {emailVerified && (
        <>
          <TextField
            label="Password"
            type={show ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={show ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant={imageUploaded ? "contained" : "outlined"}
            color={imageUploaded ? "success" : "primary"}
            component="label"
            fullWidth
            margin="normal"
            sx={{ mt: 2 }}
          >
            {imageUploaded ? "Image Uploaded!" : "Upload Picture"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </Button>
          {picLoading && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={submitHandler}
        fullWidth
        margin="normal"
        sx={{ mt: 3 }}
        disabled={picLoading || !emailVerified || !password || !confirmpassword}
      >
        {picLoading ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;


import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Navbar from "../navbar";
import DeleteNotification from "./delete";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";

import { Box, Typography, Button, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const fetchUserInfo = async (userId) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    throw error;
  }
};
const calculateTimeElapsed = (createdAt) => {
  
  const currentTime = new Date();
  const notificationTime = new Date(createdAt);
  const timeDifference = currentTime - notificationTime;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
};

const useStyles = makeStyles((theme) => ({
  notificationBox: {
    backgroundColor: theme.palette.background.alt,
    padding: theme.spacing(1),
    marginBottom: theme.spacing(0),
    width: "90%",
    maxWidth: 900,
    display: "flex",
    flexDirection: "column",
  },
  senderInfo: {
    display: "flex",
    alignItems: "center",
    //marginBottom: theme.spacing(1)
  },
}));

const NotifyPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const classes = useStyles();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const newUnreadNotifications =
      location.state && location.state.unreadNotifications;
    if (newUnreadNotifications) {
      setUnreadNotifications(newUnreadNotifications);
    }
  }, [location.state]);

  useEffect(() => {
    const processNotifications = async () => {
      const processedNotifications = await Promise.all(
        unreadNotifications.map(async (notification) => {
          try {
            let processedNotification = {};

            if (notification.action === "like") {
              const userInfo1 = await fetchUserInfo(notification.sender);
              processedNotification = {
                sender: userInfo1,
                action: "like",
                createdAt: notification.createdAt,
              };
            } else if (notification.action === "comment") {
              const userInfo2 = await fetchUserInfo(notification.sender);
              processedNotification = {
                sender: userInfo2,
                action: "comment",
                comment: notification.comment,
                createdAt: notification.createdAt,
              };
            } else if (notification.action === "register") {
              let senderData = notification.sender;
              senderData = JSON.parse(senderData);
              const { member1Data, member2Data, member3Data } = senderData;
              const sender = {
                member1: `${member1Data.firstName} ${member1Data.lastName}`,
                member2: `${member2Data.firstName} ${member2Data.lastName}`,
                member3: `${member3Data.firstName} ${member3Data.lastName}`,
              };
              processedNotification = {
                sender: sender,
                action: "register",
                id: notification._id,
                createdAt: notification.createdAt,
              };
            }
            return processedNotification;
          } catch (error) {
            console.error("Error processing notification:", error.message);
            return null;
          }
        })
      );
      setNotifications(
        processedNotifications
          .filter((notification) => notification !== null)
          .reverse()
      );
    };

    if (unreadNotifications.length > 0) {
      processNotifications();
    }
  }, [unreadNotifications]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleRequestNotificationClick = useCallback(
    (id) => {
      const clickedNotification = unreadNotifications.find(
        (notification) => notification._id === id
      );

      navigate("/RequestApproval", {
        state: { notification: clickedNotification },
      });
    },
    [unreadNotifications]
  );

  const renderNotifications = useCallback(() => {
    switch (selectedCategory) {
      case "Likes":
        return notifications
          .filter((notification) => notification.action === "like")
          .map((notification, index) => (
            <Box
              key={index}
              className={classes.notificationBox}
              sx={{
                "&:hover": {
                  bgcolor: theme.palette.background.default,
                },
              }}
            >
              <Box className={classes.senderInfo} sx={{ marginLeft: 2 }}>
                <Avatar 
                  src= {`${process.env.BACKEND_URL}/assets/${notification.sender.picturePath}`}
                  sx={{
                    width: theme.spacing(5), // Adjust size of the Avatar
                    height: theme.spacing(5), // Adjust size of the Avatar
                    borderRadius: "50%", // Make the avatar round
                    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)", // Add your shadow style here
                    overflow: "hidden", 
                  }}
                  alt="Sender"
                />
                <Box ml={2} />
                <Typography variant="body1" fontSize={15}>
                  <b>
                    {notification.sender.firstName}{" "}
                    {notification.sender.lastName}
                  </b>{" "}
                  has liked your post.
                </Typography>

                <Typography
                  variant="body2"
                  fontSize={10}
                  sx={{
                    color: theme.palette.grey[700],
                    marginLeft: "auto",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{
                      marginRight: 1,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                  <Box mb={1} mt={1}>{calculateTimeElapsed(notification.createdAt)}</Box>
                </Typography>
              </Box>
            </Box>
          ));
      case "Comments":
        return notifications
          .filter((notification) => notification.action === "comment")
          .map((notification, index) => (
            <Box
              key={index}
              className={classes.notificationBox}
              sx={{
                "&:hover": {
                  bgcolor: theme.palette.background.default,
                },
              }}
            >
              <Box className={classes.senderInfo} sx={{ marginLeft: 2 }}>
                <Avatar
                  src= {`${process.env.BACKEND_URL}/assets/${notification.sender.picturePath}`}
                  sx={{
                    width: theme.spacing(5),
                    height: theme.spacing(5),
                    borderRadius: "50%",
                    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
                    overflow: "hidden", 
                  }}
                  alt="Sender"
                />
                <Box ml={2} />
                <Typography variant="body1" fontSize={15}>
                  <b>
                    {notification.sender.firstName}{" "}
                    {notification.sender.lastName}
                  </b>{" "}
                  has commented on your post.
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={10}
                  sx={{
                    color: theme.palette.grey[700],
                    marginLeft: "auto",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{
                      marginRight: 1,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                  <Box mb={1} mt={1}>{calculateTimeElapsed(notification.createdAt)}</Box>
                </Typography>
              </Box>
            </Box>
          ));
      case "Request":
        return notifications
          .filter((notification) => notification.action === "register")
          .map((notification, index) => (
            <Box
              key={index}
              className={classes.notificationBox}
              sx={{
                "&:hover": {
                  bgcolor: theme.palette.background.default,
                },
              }}
              onClick={() => handleRequestNotificationClick(notification.id)}
            >
              <Box className={classes.senderInfo} sx={{ marginLeft: 2 }}>
                <Avatar
                  src={`${process.env.BACKEND_URL}/assets/group.jpeg`}
                  alt="Sender"
                  sx={{
                    width: theme.spacing(5), // Adjust size of the Avatar
                    height: theme.spacing(5), // Adjust size of the Avatar
                    borderRadius: "50%", // Make the avatar round
                    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)", // Add your shadow style here
                    overflow: "hidden", 
                  }}
                />
                <Box ml={2} />
                <Typography variant="body1" fontSize={15}>
                  <b>
                    {notification.sender.member1}, {notification.sender.member2}
                    , {notification.sender.member3}
                  </b>{" "}
                  have sent you a request.
                </Typography>
                <Typography
                  variant="body2"
                  fontSize={10}
                  sx={{
                    color: theme.palette.grey[700],
                    marginLeft: "auto",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{
                      marginRight: 1,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                  <Box mb={1} mt={1}>{calculateTimeElapsed(notification.createdAt)}</Box>
                </Typography>
              </Box>
            </Box>
          ));
      default:
        return notifications.map((notification, index) => {
          if (
            notification.action === "like" ||
            notification.action === "comment"
          ) {
            return (
              <Box
                key={index}
                className={classes.notificationBox}
                sx={{
                  "&:hover": {
                    bgcolor: theme.palette.background.default,
                  },
                }}
              >
                <Box className={classes.senderInfo} sx={{ marginLeft: 2 }}>
                  <Avatar
                    src= {`${process.env.BACKEND_URL}/assets/${notification.sender.picturePath}`}
                    sx={{
                      width: theme.spacing(5), // Adjust size of the Avatar
                      height: theme.spacing(5), // Adjust size of the Avatar
                      borderRadius: "50%", // Make the avatar round
                      boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)", // Add your shadow style here
                      overflow: "hidden", 
                    }}
                    alt="Sender"
                  />
                  <Box ml={2} />
                  <Typography variant="body1" fontSize={15}>
                    <b>
                      {notification.sender.firstName}{" "}
                      {notification.sender.lastName}
                    </b>{" "}
                    has{" "}
                    {notification.action === "like" ? "liked" : "commented on"}{" "}
                    your post.
                  </Typography>
                  <Typography
                  variant="body2"
                  fontSize={10}
                  sx={{
                    color: theme.palette.grey[700],
                    marginLeft: "auto",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{
                      marginRight: 1,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                  <Box mb={1} mt={1}>{calculateTimeElapsed(notification.createdAt)}</Box>
                </Typography>
                </Box>
              </Box>
            );
          } else if (notification.action === "register") {
            return (
              <Box
                key={index}
                className={classes.notificationBox}
                sx={{
                  "&:hover": {
                    bgcolor: theme.palette.background.default,
                  },
                }}
                onClick={() => handleRequestNotificationClick(notification.id)}
              >
                <Box className={classes.senderInfo} sx={{ marginLeft: 2 }}>
                  <Avatar
                    src={`${process.env.BACKEND_URL}/assets/group.jpeg`}
                    alt="Sender"
                    sx={{
                      width: theme.spacing(5), // Adjust size of the Avatar
                      height: theme.spacing(5), // Adjust size of the Avatar
                      borderRadius: "50%", // Make the avatar round
                      boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)", // Add your shadow style here
                      overflow: "hidden", 
                    }}
                  />
                  <Box ml={2} />
                  <Typography variant="body1" fontSize={15}>
                    <b>
                      {notification.sender.member1},{" "}
                      {notification.sender.member2},{" "}
                      {notification.sender.member3}
                    </b>{" "}
                    have sent you a request.
                  </Typography>
                  <Typography
                  variant="body2"
                  fontSize={10}
                  sx={{
                    color: theme.palette.grey[700],
                    marginLeft: "auto",
                    fontWeight: "bold",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 2,
                  }}
                >
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{
                      marginRight: 1,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                  <Box mb={1} mt={1} sx={{
        textAlign: 'center', // Center-align text
    }}>{calculateTimeElapsed(notification.createdAt)}</Box>
                </Typography>
                </Box>
              </Box>
            );
          } else {
            return null; // Handle other cases if necessary
          }
        });
    }
  }, [
    classes.notificationBox,
    notifications,
    selectedCategory,
    theme.palette.background.default,
  ]);

  return (
    <>
      <Navbar />
      <Box
        bgcolor={theme.palette.background.alt}
        boxShadow={4}
        borderRadius={1}
        p={3}
        mt={4}
        mx="auto"
        width="90%"
        maxWidth="900px"
        minHeight={`calc(60% + ${notifications.length * 20}px)`}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Your Notifications
        </Typography>
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent={{ xs: "center", sm: "space-between" }}
          bgcolor={theme.palette.background.default}
          boxShadow={4}
          borderRadius={1}
          p={1}
          mb={2}
          mt={2}
          mx="auto"
          width="90%"
          maxWidth="1000px"
        >
          <Button
            variant={selectedCategory === "All" ? "contained" : "outlined"}
            onClick={() => handleCategoryChange("All")}
            sx={{
              minWidth: 0,
              mb: { xs: 1, sm: 0 },
              mr: { xs: 0, sm: 1 },
              border: "none",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              View All ({notifications.length})
            </Typography>
          </Button>
          <Button
            variant={selectedCategory === "Likes" ? "contained" : "outlined"}
            onClick={() => handleCategoryChange("Likes")}
            sx={{ minWidth: 0, mb: { xs: 1, sm: 0 }, mx: 1, border: "none" }}
          >
            <Typography variant="body2" fontWeight="bold">
              Likes (
              {
                notifications.filter(
                  (notification) => notification.action === "like"
                ).length
              }
              )
            </Typography>
          </Button>
          <Button
            variant={selectedCategory === "Comments" ? "contained" : "outlined"}
            onClick={() => handleCategoryChange("Comments")}
            sx={{ minWidth: 0, mb: { xs: 1, sm: 0 }, mx: 1, border: "none" }}
          >
            <Typography variant="body2" fontWeight="bold">
              Comments (
              {
                notifications.filter(
                  (notification) => notification.action === "comment"
                ).length
              }
              )
            </Typography>
          </Button>
          <Button
            variant={selectedCategory === "Request" ? "contained" : "outlined"}
            onClick={() => handleCategoryChange("Request")}
            sx={{ minWidth: 0, mb: { xs: 1, sm: 0 }, border: "none" }}
          >
            <Typography variant="body2" fontWeight="bold">
              Request (
              {
                notifications.filter(
                  (notification) => notification.action === "register"
                ).length
              }
              )
            </Typography>
          </Button>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {renderNotifications()}
        </Box>
      </Box>
      <DeleteNotification userId={user._id} />
    </>
  );
};

export default NotifyPage;

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Navbar from "../navbar";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";

import { Box, Typography, Button, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";


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


const handleNotificationClick = async (notificationId , navigate) => {


    
    
    try {
        await fetch(`${process.env.BACKEND_URL}/studentnotification/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
            },
        });
        navigate('/OpenChat');

    } catch (error) {
        console.error('Error deleting notification:', error);
    }
};

const StudentNotifyPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const classes = useStyles();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const location = useLocation();
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const newUnreadNotifications =
            location.state && location.state.unreadNotifications;
        if (newUnreadNotifications) {
            // Extract notification ID and message for each notification
            const notificationsWithIdAndMsg = newUnreadNotifications.map(notification => {
                return {
                    id: notification._id, // Assuming the ID is stored in the _id field
                    message: notification.message,
                    createdAt: notification.createdAt,
                };
            });

            setNotifications(notificationsWithIdAndMsg.reverse());
        }
    }, [location.state]);





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
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    {/* {renderNotifications()} */}

                    {notifications.map((notification, index) => (
                        <Box
                            key={index}
                            className={classes.notificationBox}
                            onClick={() => handleNotificationClick(notification.id,navigate)} // Pass notification ID to the click handler
        
                            sx={{
                                "&:hover": {
                                    bgcolor: theme.palette.background.default,
                                },
                            }}
                        >
                            <Box className={classes.senderInfo} sx={{ marginLeft: 2 }}>
                                <Avatar
                                    src={`${process.env.BACKEND_URL}/assets/group.jpeg`}
                                    sx={{
                                        width: theme.spacing(5), // Adjust size of the Avatar
                                        height: theme.spacing(5), // Adjust size of the Avatar
                                        borderRadius: "50%", // Make the avatar round
                                        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)", // Add your shadow style here
                                    }}
                                    alt="Sender"
                                />
                                <Box ml={2} />
                                <Typography variant="body1" fontSize={15}>
                                    Your request for <b>' {notification.message.split("'")[1]} '</b> has been accepted.
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
                                    <Box mb={1} mt={1}>
                                        {calculateTimeElapsed(notification.createdAt)}
                                    </Box>
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>

    );
};

export default StudentNotifyPage;
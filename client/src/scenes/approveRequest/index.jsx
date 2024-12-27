import React, { useState } from 'react';
import { Box, Grid, Typography, Button, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Navbar from "../navbar";
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import PostWidget from "../widgets/PostWidget";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

const fetchUnreadNotifications = async (user, navigate) => {
    try {
        

        const response = await fetch(`${process.env.BACKEND_URL}/notification/${user._id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch notifications");
        }
        const notifications = await response.json();

        
        const unreadNotifications = notifications.filter(
            (notification) => !notification.read
        );

        navigate(`/Notification`, { state: { unreadNotifications: unreadNotifications } });


    } catch (error) {
        console.error("Error fetching unread notifications:", error.message);
    }
};



const RequestApproval = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [postData, setPostData] = useState(null); 
    const [groupName, setGroupName] = useState("");
    const notification = location.state && location.state.notification;
    const postid = notification && notification.postId; 
    const [acceptClicked, setAcceptClicked] = useState(false);

    const user = useSelector((state) => state.user);
    const fetchPost = async (postId) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/posts/${postId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch post');
            }
            const postData = await response.json();

            setPostData(postData); 
        } catch (error) {
            console.error('Error fetching post:', error.message);
        }
    };

    const handleDownload = (transcript) => {
        const url = `${process.env.BACKEND_URL}/transcripts/${transcript}`;
        const fileName = transcript;

        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = fileName;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };


    useEffect(() => {
        if (postid) {
            fetchPost(postid);
        }
    }, [postid]);

    let senderData = notification && notification.sender;
    senderData = senderData && JSON.parse(senderData);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    const { member1Data, member2Data, member3Data } = senderData || {};
   

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
        setAcceptClicked(false); 
    };

    const handleAccept = async () => {
    try {
        if (!groupName) {
            setAcceptClicked(true);
            return;
        }

        const requestData = {
            postId: postData._id,
            teacherId: postData.userId,
            title: postData.title,
            groupName,
            member1: member1Data,
            member2: member2Data,
            member3: member3Data,
        };

        

        const response = await axios.post(`${process.env.BACKEND_URL}/acceptRequest`, requestData);
        

        if (response && response.status >= 200 && response.status < 300) {
            
            await handleReject(notification._id);
        } else {
            
        }

        fetchUnreadNotifications(user, navigate);
    } catch (error) {
        console.error('Error accepting request:', error);
    }
};

    



    const handleReject = async (notificationId) => {

        if (notificationId) {
            try {

                await axios.delete(`${process.env.BACKEND_URL}/deleteReqNotifications/${notificationId}`);
                fetchUnreadNotifications(user, navigate);
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    };



    return (
        <>
            <Navbar />

            <Box sx={{ mt: 2, paddingLeft: '5%', paddingRight: '10%' }}> {/* Adjust left padding */}
                <Grid container spacing={3} alignItems="flex-start" sx={{ marginLeft: '10px' }}> {/* Align items to flex-start */}
                   
                    <Grid item xs={12} md={6} container justifyContent="center">
                        {postData && (
                            <PostWidget
                                key={postData._id}
                                postId={postData._id}
                                postUserId={postData.userId}
                                name={`${postData.firstName} ${postData.lastName}`}
                                title={postData.title}
                                description={postData.description}
                                picturePath={postData.picturePath}
                                userPicturePath={postData.userPicturePath}
                                likes={postData.likes}
                                comments={postData.comments}
                            />
                        )}

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                           
                            <TextField
                                label="Group Name"
                                value={groupName}
                                onChange={handleGroupNameChange}
                                variant="outlined"
                                focused
                                error={acceptClicked && !groupName} // Show error only when accept is clicked and groupName is empty
                                helperText={acceptClicked && !groupName ? 'Group name cannot be empty' : ''} // Display error message when groupName is empty after accept is clicked
                                sx={{
                                    mr: 1,
                                    borderColor: theme.palette.alt,
                                    bgcolor: theme.palette.background.alt,

                                }} // Add margin-right



                            />
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mr: 2 }}
                                onClick={() => handleAccept()}
                            >
                                Accept
                            </Button>
                            <Button
                                type="button"
                                variant="contained"
                                color="error"
                                onClick={() => handleReject(notification._id)}
                            >
                                Reject
                            </Button>
                        </Grid>


                    </Grid>

                    {/* Registration Boxes */}
                    <Grid item xs={12} md={6} container justifyContent="flex-end" sx={{ marginTop: '30px' }}> {/* Add margin to the top */}
                        {/* Member 1 Registration */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    backgroundColor: theme.palette.background.alt,
                                    marginBottom: '20px',
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.primary.main }}>
                                    Member 1 Information
                                </Typography>
                                {/* Display member1Data information */}
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Email:</b> {member1Data.email}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Name:</b> {member1Data.firstName} {member1Data.lastName}
                                </Typography>

                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Roll Number:</b> {member1Data.rollNo}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Degree:</b>  {member1Data.degree}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Batch:</b>  {member1Data.batch}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Previous Projects:</b> {member1Data.previousProjects || "None"}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Transcript: </b>
                                    <Button component="a" href={`${process.env.BACKEND_URL}/transcripts/${member1Data.transcript}`} size="small" target="_blank" rel="noopener noreferrer" variant="contained" style={{ marginRight: '8px' }}> {/* Add margin-right */}
                                        View
                                    </Button>
                                    <Button onClick={() => handleDownload(member1Data.transcript)} variant="contained" size="small">Download</Button>

                                </Typography>
                            </Box>
                        </Grid>


                        {/* Member 2 Registration */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    backgroundColor: theme.palette.background.alt,
                                    marginBottom: '20px',
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.primary.main }}>
                                    Member 2 Information
                                </Typography>
                                {/* Display member2Data information */}
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}>
                                    <b>Email:</b> {member2Data.email}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}>
                                    <b>Name:</b> {member2Data.firstName} {member2Data.lastName}
                                </Typography>

                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Roll Number:</b>  {member2Data.rollNo}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Degree:</b>  {member2Data.degree}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Batch:</b>  {member2Data.batch}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Previous Projects:</b> {member2Data.previousProjects || "None"}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}>
                                    <b>Transcript: </b>
                                    <Button component="a" href={`${process.env.BACKEND_URL}/transcripts/${member2Data.transcript}`} size="small" target="_blank" rel="noopener noreferrer" variant="contained" style={{ marginRight: '8px' }}> {/* Add margin-right */}
                                        View
                                    </Button>
                                    <Button onClick={() => handleDownload(member2Data.transcript)} variant="contained" size="small">Download</Button>
                                </Typography>
                            </Box>
                        </Grid>


                        {/* Member 3 Registration */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                    backgroundColor: theme.palette.background.alt,
                                    marginBottom: '20px',
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center", color: theme.palette.primary.main }}>
                                    Member 3 Information
                                </Typography>
                                {/* Display member2Data information */}
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}>
                                    <b>Email:</b> {member3Data.email}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}>
                                    <b>Name:</b> {member3Data.firstName} {member3Data.lastName}
                                </Typography>

                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Roll Number:</b>  {member3Data.rollNo}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Degree:</b>  {member3Data.degree}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Batch:</b>  {member3Data.batch}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Previous Projects:</b> {member3Data.previousProjects || "None"}
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ paddingLeft: '16px' }}> {/* Adjust left padding */}
                                    <b>Transcript:</b> <Button component="a" href={`${process.env.BACKEND_URL}/transcripts/${member3Data.transcript}`} size="small" target="_blank" rel="noopener noreferrer" variant="contained" style={{ marginRight: '8px' }}> {/* Add margin-right */}
                                        View
                                    </Button>
                                    <Button onClick={() => handleDownload(member3Data.transcript)} variant="contained" size="small">Download</Button>

                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>


                </Grid>
            </Box>


        </>



    );
};

export default RequestApproval;



import React, { useState, useEffect, useRef } from "react";
import { lighten } from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputLabel,
  useTheme,
  InputBase,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import { useLocation } from "react-router-dom";
import Conversation from "./Conversation";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'; // Emoji data
import { IconButton } from '@mui/material';
import { MdInsertEmoticon } from 'react-icons/md'; // Emoji Icon


const OpenChat = () => {
  const user = useSelector((state) => state.user);
  const fullName = `${user.firstName} ${user.lastName}`;
  const selectedGroupObject = useSelector((state) => state.selectedGroupObject);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [StudentsAndTeachers, setStudentsAndTeachers] = useState([]);
  const [socketUsers, setSocketUsers] = useState([]);
  const scrollRef = useRef();
  const socket = useRef();
  const theme = useTheme();

  const [show, setShow]= useState(false);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji.native); // Append selected emoji
    setShowEmojiPicker(false); // Close the picker after selection
  };

  const handleEmojiToggle = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  useEffect(() => {


    setCurrentChat(selectedGroupObject);

  }, [selectedGroupObject]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [messages]);


  useEffect(() => {
    socket.current.emit("addUser", user._id, currentChat?._id);
    socket.current.on("getUsers", (users) => {
      setSocketUsers(users);
    });
  }, [currentChat]);

  useEffect(() => {
    // Only set currentChat if selectedGroupObject is not null
    if (selectedGroupObject && Object.keys(selectedGroupObject).length !== 0) {
      setCurrentChat(selectedGroupObject);
    } else {
      setCurrentChat(null); // Ensure no chat is selected initially
    }
  }, [selectedGroupObject]);


  useEffect(() => {

    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);


  useEffect(() => {
    if (currentChat && currentChat._id) {

    }
  }, [currentChat]);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const message = {
      conversationId: currentChat._id,
      sender: user._id,
      text: newMessage


    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      conversationId: currentChat._id,
      text: newMessage,
    });


    try {
      const res = await axios.post(`${process.env.BACKEND_URL}/chats/message/`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");


      for (const memberId of currentChat.members) {
        // Make sure the memberId is not the same as the current user's ID
        // Also, check if the memberId does not exist in socketUsers
        if (memberId !== user._id && !socketUsers.some(user => user.userId === memberId)) {
          // Create an object for the member
          const memberObject = {
            groupName: currentChat.groupName,
            conversationId: currentChat._id,
            userId: memberId
          };

          // Send notification to each member
          await axios.post(`${process.env.BACKEND_URL}/chats/message/notify`, memberObject);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

  }, []);





  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/chats/conversation/` + user._id, {
          method: 'GET'
        });
        const data = await response.json();

        setConversations(data);


      } catch (err) {
        console.log(err);
      }

    };
    getConversations();
  }, []);


  function findSenderName(senderId) {
    const name = StudentsAndTeachers.find(StudentAndTeacher => StudentAndTeacher._id === senderId);
    return name ? name.fullName : 'Unknown';
  }


  useEffect(() => {
    const getStudentsAndTeachers = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/users/StudentsAndTeachers/`, {
          method: 'POST'
        });
        const data = await response.json();

        setStudentsAndTeachers(data);


      } catch (err) {
        console.log(err);
      }

    };
    getStudentsAndTeachers();

  }, []);


  useEffect(() => {
    const getMessages = async () => {
      try {

        const response = await fetch(`${process.env.BACKEND_URL}/chats/message/` + currentChat?._id, {
          method: 'GET'
        });
        const res = await response.json();
        setMessages(res);

      } catch (err) {
        console.log(err);
      }
    };
    getMessages();

  }, [currentChat]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {

    if (e.key === 'Enter' || e.key === 'Return') {

      handleSubmit(e); // Call handleSubmit function to send the message
    }
  };


  return (
    <>
      <Navbar searchType="chat" />
      <Box sx={{ backgroundColor: 'grey', width: '100vw', height: 'calc(100vh - 82px)', display: 'flex' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.mode === 'dark' ? lighten(theme.palette.background.paper, 0.05) : theme.palette.background.paper, width: '20%', height: 'calc(100vh - 82px)', marginTop: '0px', gap: '16px' }}>
          <Box
            sx={{
              width: '100%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              paddingBottom: '16px',
              boxShadow: theme.palette.mode === 'dark' ? '0px 0px 10px rgba(255, 255, 255, 0.2)' : '0px 0px 10px rgba(0, 0, 0, 0.2)',
              alignItems: 'center', // Vertically center the content
              textAlign: 'center', // Horizontally center the content
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.main, marginTop: '10px' }}>
              Chats
            </Typography>
          </Box>

          <Box>
            {conversations.map((c, index) => (
              <Box
                key={c._id}
                onClick={() =>{ setShow(true); setCurrentChat(c);}}
                sx={{
                  marginBottom: index !== conversations.length - 1 ? '16px' : 0,
                  marginLeft: '8px', // Add margin to the left
                  backgroundColor: currentChat === c ? theme.palette.primary.main : 'inherit', // Change background color if selected
                  padding: '8px',
                  borderRadius: '5px', // Add padding and border radius for better appearance
                }}
              >
                <Conversation groupName={c} />
              </Box>
            ))}
          </Box>

        </Box>
        <Box sx={{ position: 'relative', flex: 1, backgroundColor: theme.palette.background.default, height: 'calc(100vh - 82px)', display: 'flex', flexDirection: 'column' }}>
          {/* Content for the Box along the right side */}

          {show ? (
            <>
              <Box sx={{ backgroundColor: theme.palette.background.default, overflowY: 'auto', maxHeight: 'calc(100vh - 148px)', marginTop: '0', width: "100%" ,
              '&': {
                scrollbarWidth: 'none' 
              }
            
            }}>
                
                {messages.map((m, index) => (
                  <Box key={index} ref={scrollRef} sx={{
                    paddingLeft: '10px', paddingRight: '10px',}}>

                    <Message message={m} own={m.sender === user._id} senderName={findSenderName(m.sender)} />
                  </Box>
                ))}
              </Box>

              <Box className="chatBoxBottom" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.palette.background.default, padding: '8px', height: '60px', width: '100%' }}>
                {showEmojiPicker && (
                  <Box sx={{ position: 'absolute', bottom: '70px', left: '8px' }}>
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                  </Box>
                )}
                
                <InputBase
                  type="text"
                  id="chatMessageInput"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  placeholder="Write something..."
                  onKeyDown={handleKeyDown}
                  sx={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${theme.palette.neutral.light}`,
                    backgroundColor: theme.palette.neutral.light,
                    outline: 'none',
                    boxShadow: theme.palette.mode === 'dark' ? '0px 0px 10px rgba(255, 255, 255, 0.2)' : '0px 0px 10px rgba(0, 0, 0, 0.2)',
                    width: 'calc(100% - 100px)', // Adjust the width here
                    marginRight: '8px' // Add margin-right here
                  }}
                />
                <IconButton onClick={handleEmojiToggle}>
                  <MdInsertEmoticon size={24} />
                </IconButton>
                <button
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.main,
                    border: 'none',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Send
                </button>
              </Box>
      
            </>
          ) :
            (
              <Box className="ImageCenter" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
              <Box className="ImageBox" sx={{width: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexDirection: 'column' }}>
                <img className="noConversationText" src="/assets/live-chat.png" alt="Image" sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </Box>
              <Box className="TextContainer" sx={{ marginTop: '3px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', color: 'rgb(145, 136, 136)', padding: '10px' }}>
                <span className="ConversationText">Open a Conversation</span>
              </Box>
            </Box>
            )}




        </Box>
      </Box>





      {/* </Box> */}




    </>
  );

};

export default OpenChat;

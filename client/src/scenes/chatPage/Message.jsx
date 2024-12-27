import "./Message.css";
import { format } from "timeago.js";
import React, { useState  , useEffect } from 'react';
import {
    
    useTheme,
  } from "@mui/material";

  import { lighten } from '@mui/material/styles';
export default function Message(props) {
    const colors = [
        "#2ecc71", // Green
        "#1f97e7", // Blue
        "#9b59b6", // Purple
        "#e77b1d", // Orange
        "#e91e63", // Pink
        "#19deb6", // Light Blue
        "#60c5ed", // Sky Blue
        "#e74c3c"  // Red
    ];

    // Generate a random index to select a color
    const theme = useTheme();
    
    const randomIndex = Math.floor(Math.random() * colors.length);
    const randomColor = colors[randomIndex];
    const [message, setMessage] = useState(props.message.text);
    const [name , setName] = useState(props.senderName);
    

    return (
        <div className={props.own ? "message own" : "message"}>
            <div className="messageTop">
                <div className="messageBubble" style={{backgroundColor: props.own ? '#18d5f2' : theme.palette.mode === 'dark'? lighten(theme.palette.background.paper, 0.05) :theme.palette.background.paper}}>
                    {!props.own && <p className="messageSender" style={{ color: randomColor }}>{name}</p>}
                    <p className="messageText"  style={{ color:  theme.palette.main }}>{message}</p>
                </div>
            </div>
            <div className="messageBottom">{format(props.message.createdAt)}</div>
        </div>
    );
}

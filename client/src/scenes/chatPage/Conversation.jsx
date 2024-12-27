import axios from "axios";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { Height } from "@mui/icons-material";
import { lighten } from '@mui/material/styles';

export default function Conversation(prop) {
  const [loginUser, setLoginUser] = useState(null);
  const [groups, setGroups] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (prop.groupName) {
      const filteredData = prop.groupName.groupName;
      setGroups(filteredData);
    }
  }, [prop]);

  return (
    <div sx={{backgroundColor: theme.palette.primary.dark , height: '500px'}}>
      <div
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          cursor: 'pointer',
          backgroundColor: theme.palette.primary.dark, // Using theme color for background
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
          '@media screen and (max-width: 768px)': {
            '.conversationName': {
              display: 'none',
            },
          },
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <Avatar src="/assets/dummy.jpeg" alt="Avatar" sx={{ marginRight: '20px' }} />
          <span sx={{ fontWeight: '500', color: theme.palette.main }}>{groups}</span>
        </div>
      </div>
    </div>
  );
}

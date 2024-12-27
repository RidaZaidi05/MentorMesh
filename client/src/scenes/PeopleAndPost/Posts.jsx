import { Box, Typography, Divider, useTheme } from '@mui/material';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import Post from "./Post";

const Posts = ({ posts }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const theme = useTheme();

  return (
    <Box mt="2rem"> {/* Add margin-top to create space */}
      <Box sx={{ padding: '16px', backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Posts
        </Typography>
        <Divider />
      

      
        {posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            title,
            description,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <Box
              key={_id}
              sx={{
                boxShadow: theme.palette.mode === 'dark' ? '0px 0px 10px rgba(255, 255, 255, 0.2)' : '0px 0px 10px rgba(0, 0, 0, 0.2)',
                marginBottom: '1rem', // Add bottom margin for spacing between posts
                borderRadius: '8px',
              }}
            >
            <Post
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              title={title}
              description={description}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};

export default Posts;

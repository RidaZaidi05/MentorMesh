import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { MdOutlineGroupAdd } from "react-icons/md";
import UserImage from "../../components/UserImage";
import { useNavigate } from "react-router-dom";
const Post = ({
  postId,
  postUserId,
  name,
  title,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const navigate = useNavigate();
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const userType = useSelector((state) => state.userType);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;
  const theme = useTheme();

  const patchLike = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

  };

  const postComment = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: newComment }), // Include userId in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));

      // Clear the comment space after posting a comment
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error.message);
    }
  };
  const handleClick = () => {
    // Encode the title and postuerId
    const encodedTitle = encodeURIComponent(title);
    const encodedPostUerId = encodeURIComponent(postUserId);
    const encodedPostId = encodeURIComponent(postId);

    // Navigate to the request page with the title and postuerId as query parameters
    navigate(`/request_form?title=${encodedTitle}&postUserId=${encodedPostUerId}&postId=${encodedPostId}`);

  };
  return (
    <WidgetWrapper m="2rem 0" sx={{ backgroundColor: theme.palette.background.paper }}>

      <FlexBetween>
        <FlexBetween gap="1rem">
          <UserImage image={userPicturePath} size="55px" />
          <Box
            onClick={() => {

              navigate(`/profile/${postUserId}`);
            }}
          >
            <Typography
              color={theme.palette.mode === 'dark' ? palette.primary.main : palette.default}
              variant="h5"
              fontWeight="bold" // Make the text bold
              sx={{
                "&:hover": {
                  color: palette.primary.main,
                  cursor: "pointer",
                },
              }}
            >

              {name}
            </Typography>

          </Box>
        </FlexBetween>


      </FlexBetween>
      {/* Render title if it exists */}
      {title && (
        <Box mt="1rem">
          <Typography variant="h6" color={main}>
            <strong>Title: </strong><span style={{ fontWeight: 100 }}>{`"${title}"`}</span>
          </Typography>
        </Box>
      )}

      {/* Render description if it exists */}
      {description && (
        <Box mt="1rem">
          <Typography variant="h6" color={main}>
            <strong>Description: </strong> <span style={{ fontWeight: 100 }}>{`${description}`}</span>
          </Typography>
        </Box>
      )}
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${process.env.BACKEND_URL}/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>

          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
          {userType === "student" && (
            <FlexBetween gap="0.9rem">
              <IconButton onClick={handleClick} sx={{ fontSize: '1.3rem', marginTop: '-0.1rem' }} >
                <MdOutlineGroupAdd />
              </IconButton>

            </FlexBetween>
          )}
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {<strong>{comment.firstName} {comment.lastName}:</strong>} {comment.comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          <InputBase
            placeholder="Your Comment"
            value={newComment} // Bind the input value to newComment state
            onChange={(e) => setNewComment(e.target.value)} // Update the newComment state
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
              margin: "15px"
            }}
          />

          <Button onClick={postComment} variant="contained" color="primary" sx={{ mt: '0.5rem', borderRadius: '50px' }}>Send</Button>

        </Box>
      )}
    </WidgetWrapper>
  );
};

export default Post;
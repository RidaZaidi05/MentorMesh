import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";


const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const sortedPosts = data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt); // Assuming createdAt field represents timestamp
    });
    dispatch(setPosts({ posts: sortedPosts }));
  };
  
  const getUserPosts = async () => {
    const response = await fetch(
      `${process.env.BACKEND_URL}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    const sortedPosts = data.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt); // Assuming createdAt field represents timestamp
    });
    dispatch(setPosts({ posts: sortedPosts }));
  };
  
  useEffect(() => {
    const fetchPosts = async () => {
      if (isProfile) {
        await getUserPosts();
      } else {
        await getPosts();
      }
    };

    fetchPosts();
  }, [isProfile, userId]);

  return (
    <>
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
          <PostWidget
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
        )
      )}
    </>
  );
};

export default PostsWidget;

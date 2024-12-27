import Post from "../models/Post.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Notification from "../models/notification.js";
/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, title, description, picturePath } = req.body; // Extract title from req.body
    const teacher = await Teacher.findById(userId);
    const newPost = new Post({
      userId,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      title, // Include title in the new post
      description,
      userPicturePath: teacher.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

// /* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    console.log("helloo reached");
    const { postId } = req.params;
    const post = await Post.findById(postId);
    console.log(post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// /* UPDATE */
export const likePost = async (io, req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
      await deleteNotification(post.userId, userId, id, "like");
    } else {
      post.likes.set(userId, true);
      await createNotification(io, post.userId, userId, id, "like");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    io.emit("notification", {
      type: "like",
      postId: id,
      userId: userId,
    });

    res.status(200).json(updatedPost);
    // window.location.reload();
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// /* UPDATE - Add Comment */
// /* UPDATE - Add Comment */
export const addComment = async (io, req, res) => {
  // Add io parameter
  try {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let user;

    // Find the user by userId to get the first name and last name
    user = await Teacher.findById(userId);

    if (!user) {
      user = await Student.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    post.comments.push({
      userId: userId,
      firstName: user.firstName,
      lastName: user.lastName,
      comment: comment,
    });

    // Emit a comment notification to the post owner
    await createNotification(io, post.userId, userId, postId, "comment");

    // Save the updated post
    const updatedPost = await post.save();

    // Emit a socket.io event to update the client with the updated post
    io.emit("postUpdated", updatedPost);

    res.status(201).json(updatedPost);
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const createNotification = async (
  io,
  recipient,
  sender,
  postId,
  action
) => {
  try {
    const newNotification = new Notification({
      recipient,
      sender,
      postId,
      action,
    });
    await newNotification.save();
    io.emit("notification", newNotification);
  } catch (error) {
    console.error("Error creating notification:", error.message);
  }
};

const deleteNotification = async (recipientId, senderId, postId, action) => {
  try {
    // Assuming you have a Notification model imported

    // Find the notification to delete based on the provided criteria
    const notificationToDelete = await Notification.findOneAndDelete({
      recipient: recipientId,
      sender: senderId,
      postId: postId,
      action: action,
    });

    if (!notificationToDelete) {
      console.log("Notification not found or already deleted");
      return;
    }
  } catch (error) {
    console.error("Error deleting notification:", error.message);
  }
};

export const requestNotification = async (io, req, res) => {
  try {
    const { postId, teacherId, title, member1Data, member2Data, member3Data } =
      req.body;
    const membersData = [member1Data, member2Data, member3Data];
    console.log(membersData);
    const existingStudents = [];

    for (const memberData of membersData) {
      const rollNumber = memberData.rollNumber;
      const student = await Student.findOne({ rollNo: rollNumber });
      existingStudents.push(student);
  }
    console.log(existingStudents);

    const newMembers = existingStudents.map((student, index) => {

      const memberData_ = membersData[index];
      

      return {
        userId: student._id,
        rollNo: student.rollNo,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        transcript: memberData_.transcript || "",
        previousProjects: memberData_.previousProjects || "",
        batch: student.passingyear,
        degree: student.degree || "",
      };
    });
    console.log(newMembers);

    

    // Constructing sender object with member data
    const sender = JSON.stringify({
      member1Data:  newMembers[0],
      member2Data: newMembers[1],
      member3Data: newMembers[2],
    });

    console.log(sender);

    await createNotification(io, teacherId, sender, postId, "register");

    // Sending response
    res.status(200).json({ message: "transcript uploaded successfully" });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


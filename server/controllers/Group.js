import Conversation from '../models/Conversation.js'; // Import the Group model



export const searchGroups = async (req, res) => {
  try {
    const groups = await Conversation.find();
   // const groupNames = groups.map(group => group.groupName);
    res.status(200).json(groups); // Sending only the group names in the response
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
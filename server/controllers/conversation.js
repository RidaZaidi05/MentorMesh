import Conversation from "../models/Conversation.js"; // Adjust import statement to use named import

// Define route handler for creating a conversation
export async function createConversation(req, res) {
  const newConversation = new Conversation({
    groupName : req.body.name , 
    members: [req.body.teacherId, req.body.student1, req.body.student2, req.body.student3],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

export async function getGroupsbyId(req, res) {
    try {
        const conversation = await Conversation.find({
            'members': { $in: [req.params.id] }
          });
        
          
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
};


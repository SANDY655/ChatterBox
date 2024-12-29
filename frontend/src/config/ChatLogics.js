export const getSender = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

  export const getSenderFull=(loggedUser,users)=>{
    return users[0]._id === loggedUser._id ? users[1] : users[0];
    
  }
  
  export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };

  
  export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      m.sender._id !== userId
    ) {
      return 8; // Reduced margin for consecutive messages from the same sender
    } else if (m.sender._id === userId) {
      return 'auto'; // Right-align user messages
    } else {
      return 5; // Default margin for other cases
    }
  };
  
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
 
  export const getLatestMessage = (chat) => {
    // Ensure chat has messages and messages is an array
    if (chat && chat.messages && chat.messages.length > 0) {
      return chat.messages[chat.messages.length - 1]; // Return the last message
    }
    return null; // If no messages exist, return null
  };
  export const getSenderAvatar = (loggedUser, users) => {
    // Find the user that is not the logged-in user (the sender of the message)
    const sender = users.find(user => user._id !== loggedUser._id);
  
    // If sender is found, return their pic, otherwise return a default avatar
    return sender ? sender.pic : '/path/to/default-avatar.jpg';
  };
  
  
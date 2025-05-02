export function useMessageMapper() {
    const mapMessages = (data) => {
      const messageMap = {};
      data.forEach(msg => {
        messageMap[msg.id] = msg;
      });
      data.forEach(msg => {
        if (msg.reply_to_id && messageMap[msg.reply_to_id]) {
          msg.reply = messageMap[msg.reply_to_id].content;
        }
        if (msg.response && msg.response.reply_to_id && messageMap[msg.response.reply_to_id]) {
          msg.response.reply = messageMap[msg.response.reply_to_id].content;
        }
      });
      return data;
    };
  
    return { mapMessages };
  }
  
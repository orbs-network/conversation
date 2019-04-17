import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const sendAndClean = () => {
    onSend(message);
    setMessage('');
  };

  return (
    <>
      <textarea
        rows="15"
        placeholder="What's up?"
        value={message}
        onChange={ev => setMessage(ev.target.value)}
      />
      <button onClick={sendAndClean}>Send</button>
    </>
  );
};

export default MessageInput;

import React, { useState } from 'react';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const sendAndClean = () => {
    if (message) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <>
      <br />
      <textarea
        rows="15"
        placeholder="What's up?"
        value={message}
        onKeyPress={ev => ev.key === 'Enter' && sendAndClean()}
        onChange={ev => setMessage(ev.target.value)}
      />
      <button onClick={sendAndClean}>Send</button>
    </>
  );
};

export default MessageInput;

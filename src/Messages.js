import React from 'react';

const Messages = ({ messages }) => {
  return (
    <ul>
      {Object.values(messages).map(message => {
        return (
          <li key={message.id}>
            {message.id} - {message.Message}
          </li>
        );
      })}
    </ul>
  );
};

export default Messages;

import React from 'react';

const Messages = ({ messages, prismUrl }) => {
  return (
    <>
      {Object.values(messages).map(m => {
        const date = new Date(m.Timestamp / 1000000)
          .toISOString()
          .substr(11, 12);
        const author = m.Author.substr(0, 6);
        const prismLink = `${prismUrl}/block/${m.BlockHeight}`;
        return (
          <div className="row" key={m.id}>
            <div className="column column-10">
              <a href={prismLink} target="_blank" rel="noopener noreferrer">
                {date}
              </a>{' '}
            </div>
            <strong className="column column-10" title={`0x${m.Author}`}>{author}:</strong>
            <div className="column column-90">{m.Message}</div>
          </div>
        );
      })}
    </>
  );
};

export default Messages;

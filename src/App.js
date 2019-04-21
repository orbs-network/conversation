import './App.css';
import Messages from './Messages';
import MessageInput from './MessageInput';
import React, { useEffect, useState } from 'react';
import { Client, argString, argUint64 } from 'orbs-client-sdk/dist/index.es';

const App = ({
  publicKey,
  privateKey,
  contractName,
  channel,
  nodeUrl,
  virtualChainId,
  prismUrl,
  address
}) => {
  const [messages, setMessages] = useState({});

  const orbsClient = new Client(`${nodeUrl}`, virtualChainId, 'TEST_NET');

  const verifyResponse = response => {
    if (
      response.requestStatus !== 'COMPLETED' &&
      response.executionResult !== 'SUCCESS' &&
      response.transactionStatus !== 'COMMITTED'
    ) {
      console.error(response);
      throw new Error(response);
    }
  };

  let messagesCursor = 1;
  const cursorLength = 5;

  const fetchMessages = async () => {
    const query = orbsClient.createQuery(
      publicKey,
      contractName,
      'getMessagesForChannel',
      [
        argString(channel),
        argUint64(messagesCursor),
        argUint64(messagesCursor + cursorLength)
      ]
    );
    try {
      const response = await orbsClient.sendQuery(query);
      verifyResponse(response);
      const data = JSON.parse(response.outputArguments[0].value);
      if (data && data.length) {
        messagesCursor += data.length;
        const newMessages = data.reduce((acc, curr) => {
          acc[curr.ID] = curr;
          acc[curr.ID].id = curr.ID;
          return acc;
        }, messages);
        setMessages({ ...newMessages });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitMessage = async text => {
    const [tx] = orbsClient.createTransaction(
      publicKey,
      privateKey,
      contractName,
      'sendMessageToChannel',
      [argString(channel), argString(text)]
    );

    const response = await orbsClient.sendTransaction(tx);
    verifyResponse(response);

    console.log(response.outputArguments[0].value);
  };

  const REFRESH_RATE = 1 * 1000;

  useEffect(() => {
    fetchMessages();
    setInterval(fetchMessages, REFRESH_RATE);
  }, []);

  return (
    <main className="container">
      <nav className="navigation">
        <section className="container">
          <h1 className="title">Conversation App</h1>
          <div>your address: {address}</div>
          <div>channel: {channel}</div>
          <div>
            contract:{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${prismUrl}/contract/${contractName}`}
            >
              {contractName}
            </a>
          </div>
        </section>
      </nav>
      <Messages prismUrl={prismUrl} messages={messages} />
      <MessageInput onSend={submitMessage} />
    </main>
  );
};

export default App;

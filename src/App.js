import './App.css';
import Messages from './Messages';
import React, { useEffect, useState } from 'react';
import { Client, argString, argUint64 } from 'orbs-client-sdk/dist/index.es';
import MessageInput from './MessageInput';

const App = ({
  publicKey,
  privateKey,
  contractName,
  channel,
  nodeAddress,
  virtualChainId,
  prismAddress,
  address
}) => {
  const [messages, setMessages] = useState({});

  const orbsClient = new Client(
    `${nodeAddress}/vchains/${virtualChainId}`,
    virtualChainId,
    'TEST_NET'
  );

  const verifyResponse = response => {
    if (
      response.requestStatus !== 'COMPLETED' &&
      response.executionResult !== 'SUCCESS' &&
      response.transactionStatus !== 'COMMITTED'
    ) {
      throw new Error(response);
    }
  };

  let messagesCursor = 0;
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
        messagesCursor += cursorLength;
        const newMessages = data.reduce((acc, curr) => {
          if (curr.ID !== 0) {
            acc[curr.ID] = curr;
            acc[curr.ID].id = curr.ID;
          }
          return acc;
        }, messages);
        setMessages({...newMessages});
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

  useEffect(() => {
    fetchMessages();
    setInterval(fetchMessages, 2 * 1000);
  }, []);

  return (
    <main className="container">
      <nav className="navigation">
        <section className="container">
          <h1 className="title">Conversation App</h1>
          <div>your address: {address}</div>
          <div>channel: {channel}</div>
        </section>
      </nav>
      <Messages
        prismUrl={`${prismAddress}vchains/${virtualChainId}`}
        messages={messages}
      />
      <MessageInput onSend={submitMessage} />
    </main>
  );
};

export default App;

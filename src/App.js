import './App.css';
import Messages from './Messages';
import React, { useEffect, useState } from 'react';
import { Client, argString, argUint64 } from 'orbs-client-sdk/dist/index.es';
import MessageInput from './MessageInput';

const App = ({
  publicKey,
  contractName,
  channel,
  nodeAddress,
  virtualChainId
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

  const messagesCursor = 0;

  const fetchMessages = async () => {
    const query = orbsClient.createQuery(
      publicKey,
      contractName,
      'getMessagesForChannel',
      [
        argString(channel),
        argUint64(messagesCursor),
        argUint64(messagesCursor + 50)
      ]
    );
    try {
      const response = await orbsClient.sendQuery(query);
      verifyResponse(response);
      const messages = JSON.parse(response.outputArguments[0].value);
      setMessages(
        messages.reduce((acc, curr) => {
          acc[curr.ID] = curr;
          acc[curr.ID].id = curr.ID;
          return acc;
        }, {})
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onSendHandler = (text) => {
    console.log(text);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <main className="container">
      <nav className="navigation">
        <section className="container">
          <h1 className="title">Conversation App</h1>
        </section>
      </nav>
      <Messages messages={messages} />
      <MessageInput onSend={onSendHandler} />
    </main>
  );
};

export default App;

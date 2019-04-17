import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  createAccount,
  decodeHex,
  encodeHex
} from 'orbs-client-sdk/dist/index.es';

const SENDER_PUBLIC_KEY = 'sender_public_key';
const SENDER_PRIVATE_KEY = 'sender_private_key';
const SENDER_ADDRESS = 'sender_address';

const config = {
  publicKey: '',
  privateKey: '',
  address: '',
  nodeAddress: 'http://52.37.172.206/',
  virtualChainId: 2013,
  contractName: 'orbs_conversation',
  channel: 'orbs',
  prismAddress: 'https://prism.orbs-test.com/'
};

if (!localStorage.getItem(SENDER_PUBLIC_KEY)) {
  const sender = createAccount();
  localStorage.setItem(SENDER_PUBLIC_KEY, encodeHex(sender.publicKey));
  localStorage.setItem(SENDER_PRIVATE_KEY, encodeHex(sender.privateKey));
  localStorage.setItem(SENDER_ADDRESS, sender.address);
}

config['publicKey'] = decodeHex(localStorage.getItem(SENDER_PUBLIC_KEY));
config['privateKey'] = decodeHex(localStorage.getItem(SENDER_PRIVATE_KEY));
config['address'] = localStorage.getItem(SENDER_ADDRESS);

ReactDOM.render(<App {...config} />, document.getElementById('root'));

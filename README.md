# Conversation Example App
> This is an end-to-end demo application of dApp based on Orbs Network with Smart Contract

## Scope
1. Write a smart contract
1. Working locally with `gamma-cli` and deploy the contract
1. Simple React app using `orbs-client-sdk` to query smart contract

## Run locally
1. Install gamma-cli according to the [instructions](https://github.com/orbs-network/gamma-cli#installation)
1. `git clone https://github.com/orbs-network/conversation && cd conversation`
1. `npm install`
1. Launch local gamma server `gamma-cli start-local`
1. Deploy the contract `gamma-cli deploy ./contract/contract.go -name orbs_conversation -signer user1`
1. Launch static server `npm start`
1. Go to [http://localhost:3000](http://localhost:3000)
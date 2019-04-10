const fs = require("fs");
const _ = require("lodash");
const Orbs = require("orbs-client-sdk");
const Sentencer = require('sentencer');
const { Conversation } = require("./index");

const sender = Orbs.createAccount();

const endpoint = `http://localhost:8080`;

(async () => {
    try {
        const client = new Orbs.Client(endpoint, 42, "TEST_NET");
        // deploy contract tx
        const code = new Uint8Array(fs.readFileSync(`${__dirname}/contract/contract.go`));
        const [tx, txId] = client.createTransaction(sender.publicKey, sender.privateKey, "_Deployments", "deployService", [Orbs.argString("testContract"), Orbs.argUint32(1), Orbs.argBytes(code)]);
    
        // send the transaction
        const deployResponse = await client.sendTransaction(tx);
        console.log("Deploy response:");
        console.log(deployResponse);
    } catch (e) {
        console.log(e);
    }
    
})();

const conversation = new Conversation(Orbs, {
    endpoint,
    virtualChainId: 42,
    contractName: "testContract"
}, {
    publicKey: sender.publicKey,
    privateKey: sender.privateKey
});

setInterval(async () => {
    const sentence = Sentencer.make("The {{ noun }} has {{ an_adjective }} {{ noun }}.");
    const messageId = await conversation.sendMessageToChannel("myChannel", sentence);
    console.log(`Saved message with id ${messageId}`);
}, 1000);

conversation.scroll("myChannel", 1, (messages) => {
    for (m of messages) {
        console.log(m);
    }
});

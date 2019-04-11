const fs = require("fs");
const Orbs = require("orbs-client-sdk");

// const params = {
//     endpoint: "http://localhost:8080",
//     virtualChainId: 42,
//     contractName: "orbs_conversation",
//     channel: "orbs"
// };

const params = {
    endpoint: `http://52.37.172.206/vchains/2013`,
    virtualChainId: 2013,
    contractName: "orbs_conversation"
};

(async ({ endpoint, virtualChainId, contractName }) => {
    try {
        const sender = Orbs.createAccount();
        const client = new Orbs.Client(endpoint, virtualChainId, "TEST_NET");
        // deploy contract tx
        const code = new Uint8Array(fs.readFileSync(`${__dirname}/contract/contract.go`));
        const [tx, txId] = client.createTransaction(sender.publicKey, sender.privateKey, "_Deployments", "deployService", [Orbs.argString(contractName), Orbs.argUint32(1), Orbs.argBytes(code)]);
    
        // send the transaction
        const deployResponse = await client.sendTransaction(tx);
        console.log("Deploy response:");
        console.log(deployResponse);
    } catch (e) {
        console.log(e);
    }
})(params);

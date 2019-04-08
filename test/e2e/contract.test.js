/**
 * Copyright 2019 the orbs-client-sdk-javascript authors
 * This file is part of the orbs-client-sdk-javascript library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

const Orbs = require("../../../orbs-client-sdk-javascript/dist/index.js");
const GammaDriver = require("./gamma-driver");
const fs = require("fs");

const VIRTUAL_CHAIN_ID = 42; // gamma-cli config default
describe("E2E nodejs", () => {
  const gammeDriver = new GammaDriver();

  beforeEach(async () => {
    jest.setTimeout(60000);
    await gammeDriver.start();
  });

  afterEach(async () => {
    await gammeDriver.stop();
  });

  test("Conversation", async () => {
    // create sender account
    const sender = Orbs.createAccount();

    // create receiver account
    const receiver = Orbs.createAccount();

    // create client
    const endpoint = gammeDriver.getEndpoint();
    const client = new Orbs.Client(endpoint, VIRTUAL_CHAIN_ID, "TEST_NET");

    // deploy contract tx
    const code = new Uint8Array(fs.readFileSync(`${__dirname}/../../contract/contract.go`));
    const [tx, txId] = client.createTransaction(sender.publicKey, sender.privateKey, "_Deployments", "deployService", [Orbs.argString("testContract"), Orbs.argUint32(1), Orbs.argBytes(code)]);

    // send the transaction
    const deployResponse = await client.sendTransaction(tx);
    console.log("Deploy response:");
    console.log(deployResponse);
    expect(deployResponse.requestStatus).toEqual("COMPLETED");
    expect(deployResponse.executionResult).toEqual("SUCCESS");
    expect(deployResponse.transactionStatus).toEqual("COMMITTED");

    const [sendMessageTx] = client.createTransaction(sender.publicKey, sender.privateKey, "testContract", "sendMessageToChannel", [Orbs.argString("defaultChannel"), Orbs.argString("what's up?")]);

    // send the transaction
    const sendMessageResponse = await client.sendTransaction(sendMessageTx);
    console.log("sendMessageResponse:");
    console.log(sendMessageResponse);
    expect(sendMessageResponse.requestStatus).toEqual("COMPLETED");
    expect(sendMessageResponse.executionResult).toEqual("SUCCESS");
    expect(sendMessageResponse.transactionStatus).toEqual("COMMITTED");

    const [getMessagesTx] = client.createTransaction(sender.publicKey, sender.privateKey, "testContract", "getMessagesForChannel", [Orbs.argString("defaultChannel"), Orbs.argUint64(1), Orbs.argUint64(1)]);

    // send the transaction
    const getMessagesResponse = await client.sendTransaction(getMessagesTx);
    console.log("getMessagesResponse:");
    console.log(getMessagesResponse);
    expect(getMessagesResponse.requestStatus).toEqual("COMPLETED");
    expect(getMessagesResponse.executionResult).toEqual("SUCCESS");
    expect(getMessagesResponse.transactionStatus).toEqual("COMMITTED");

    console.log(getMessagesResponse.outputArguments)
    const message = JSON.parse(Buffer.from(getMessagesResponse.outputArguments[0].value).toString())[0];
    console.log(message);
    expect(message.ID).toEqual(1);
    expect(message.Message).toEqual("what's up?");
    expect(message).toHaveProperty("Timestamp");
    expect(message).toHaveProperty("Author");
  });
});

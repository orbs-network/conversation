/**
 * Copyright 2019 the orbs-client-sdk-javascript authors
 * This file is part of the orbs-client-sdk-javascript library in the Orbs project.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 * The above notice should be included in all copies or substantial portions of the software.
 */

const Orbs = require("orbs-client-sdk");
const GammaDriver = require("./gamma-driver");
const fs = require("fs");
const { Conversation } = require("../../index");

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

    const c = new Conversation(Orbs, {
      endpoint,
      virtualChainId: VIRTUAL_CHAIN_ID,
      contractName: "testContract"
    }, {
      publicKey: sender.publicKey,
      privateKey: sender.privateKey
    })

    const messageId = await c.sendMessageToChannel("defaultChannel", "what's up?");
    expect(messageId).toEqual(BigInt(1));

    const [message] = await c.getMessagesForChannel("defaultChannel", 1, 1);
    console.log(message);
    expect(message.ID).toEqual(1);
    expect(message.Message).toEqual("what's up?");
    expect(message).toHaveProperty("Timestamp");
    expect(message).toHaveProperty("Author");    
  });
});

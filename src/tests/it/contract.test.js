const Orbs = require('orbs-client-sdk');
const GammaDriver = require('./gamma-driver');

describe('Contract Integration', () => {
  const gammaDriver = new GammaDriver();
  const contractName = 'orbs_conversation';

  beforeEach(async () => {
    jest.setTimeout(60000);
    await gammaDriver.start();
    await gammaDriver.deployContract(
      contractName,
      `${process.cwd()}/contract/contract.go`
    );
  });

  afterEach(async () => {
    await gammaDriver.stop();
  });

  it('should be able to send and fetch messages', async () => {
    const { publicKey, privateKey } = Orbs.createAccount();
    const client = new Orbs.Client(gammaDriver.getEndpoint(), 42, 'TEST_NET');

    const testText = 'hello world';

    const [tx] = client.createTransaction(
      publicKey,
      privateKey,
      contractName,
      'sendMessageToChannel',
      [Orbs.argString('test-channel'), Orbs.argString(testText)]
    );

    await client.sendTransaction(tx);

    const query = client.createQuery(
      publicKey,
      contractName,
      'getMessagesForChannel',
      [Orbs.argString('test-channel'), Orbs.argUint64(0), Orbs.argUint64(5)]
    );

    const response = await client.sendQuery(query);
    const messages = JSON.parse(response.outputArguments[0].value);

    expect(messages.length).toEqual(2);
    expect(messages[1].Message).toEqual(testText);
  });
});

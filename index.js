async function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

function verifyResponse(response) {
    if (response.requestStatus != "COMPLETED" && response.executionResult != "SUCCESS" && response.transactionStatus != "COMMITTED") {
        throw new Error(response);
    }
}

class Conversation {
    constructor(Orbs, { endpoint, virtualChainId, contractName }, { publicKey, privateKey }) {
        this.Orbs = Orbs;
        this.config = { endpoint, virtualChainId, contractName };
        this.credentials = { publicKey, privateKey };

        this.client = new this.Orbs.Client(endpoint, virtualChainId, "TEST_NET");
    }

    async sendMessageToChannel(channel, message) {
        const [tx] = this.client.createTransaction(this.credentials.publicKey, this.credentials.privateKey, this.config.contractName, "sendMessageToChannel", [this.Orbs.argString(channel), this.Orbs.argString(message)]);

        const response = await this.client.sendTransaction(tx);
        verifyResponse(response);

        return response.outputArguments[0].value;
    }

    async getMessagesForChannel(channel, from, to) {
        const [tx] = this.client.createTransaction(this.credentials.publicKey, this.credentials.privateKey, this.config.contractName, "getMessagesForChannel", [this.Orbs.argString(channel), this.Orbs.argUint64(from), this.Orbs.argUint64(to)]);

        const response = await this.client.sendTransaction(tx);
        verifyResponse(response);

        return JSON.parse(response.outputArguments[0].value);
    }

    async scroll(channel, from, callback) {
        let firstItem = from;
        while (true) {
            try {
                const messages = await this.getMessagesForChannel(channel, firstItem, firstItem+50);
                if (messages && messages.length > 0) {
                    callback(messages);
                    firstItem = messages[messages.length - 1].ID + 1;
                }
            } catch (e) {
                console.log(e);
            }

            await delay(200);
        }
    }
}

if (typeof(module) != "undefined") {
    module.exports = {
        Conversation
    };
}

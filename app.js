class App {
    constructor(Orbs, endpoint, { publicKey, privateKey }) {
        this.conversation = new Conversation(Orbs, {
            endpoint,
            virtualChainId: 42,
            contractName: "testContract"
        }, {
            publicKey,
            privateKey
        });
    }

    async send() {
        const sentence = document.getElementById("message_content").value;
        const messageId = await this.conversation.sendMessageToChannel("myChannel", sentence);
        console.log(`saved message with id ${messageId}`);
        return false;
    }

    async run() {
        this.conversation.scroll("myChannel", 1, (messages) => {
            for (const m of messages) {
                const container = document.getElementById("messages");
                const date = new Date(m.Timestamp/1000000);
                const text = document.createTextNode(`${date.toISOString()} ${m.Author}: ${m.Message}\n\n`);

                container.insertBefore(text, container.childNodes[0]);
            }
        });
    }
}

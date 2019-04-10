const sender = Orbs.createAccount();

const endpoint = `http://localhost:8080`;

const conversation = new Conversation({
    endpoint,
    virtualChainId: 42,
    contractName: "testContract"
}, {
    publicKey: sender.publicKey,
    privateKey: sender.privateKey
});

// setInterval(async () => {
//     const sentence = "Hey!";
//     const messageId = await conversation.sendMessageToChannel("myChannel", sentence);
//     console.log(`Saved message with id ${messageId}`);
// }, 1000);

async function send() {
    const sentence = document.getElementById("message_content").value;
    const messageId = await conversation.sendMessageToChannel("myChannel", sentence);
    console.log(`saved message with id ${messageId}`);
    return false;
}

conversation.scroll("myChannel", 1, (messages) => {
    for (m of messages) {
        const container = document.getElementById("messages");
        const date = new Date(m.Timestamp/1000000);
        const text = document.createTextNode(`${date.toISOString()} ${m.Author}: ${m.Message}\n\n`);

        container.insertBefore(text, container.childNodes[0]);
    }
});

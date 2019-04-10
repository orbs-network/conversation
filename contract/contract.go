package main

import (
	"encoding/hex"
	"encoding/json"
	"strconv"

	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/address"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/env"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(sendMessageToChannel, getMessagesForChannel, getLastMessageIdForChannel)
var SYSTEM = sdk.Export(_init)

type Message struct {
	ID        uint64
	Timestamp uint64
	Author    string
	Message   string
}

func _init() {

}

func sendMessageToChannel(channel string, message string) (messageID uint64) {
	messageID = state.ReadUint64(counterKey(channel))
	messageID++
	state.WriteUint64(counterKey(channel), messageID)
	state.WriteBytes(authorKey(channel, messageID), address.GetSignerAddress())
	state.WriteString(messageKey(channel, messageID), message)
	state.WriteUint64(timestampKey(channel, messageID), env.GetBlockTimestamp())
	return
}

func getMessagesForChannel(channel string, from uint64, to uint64) string {
	lastMessageID := state.ReadUint64(counterKey(channel))
	max := to

	if to > lastMessageID {
		max = lastMessageID
	}

	var messages []*Message
	for i := uint64(from); i <= max; i++ {
		messages = append(messages, &Message{
			i,
			state.ReadUint64(timestampKey(channel, i)),
			hex.EncodeToString(state.ReadBytes(authorKey(channel, i))),
			state.ReadString(messageKey(channel, i)),
		})
	}

	data, _ := json.Marshal(messages)
	return string(data)
}

func getLastMessageIdForChannel(channel string) uint64 {
	return state.ReadUint64(counterKey(channel))
}

func authorKey(channel string, messageID uint64) []byte {
	return []byte("a_" + channel + "_" + strconv.FormatUint(messageID, 10))
}

func messageKey(channel string, messageID uint64) []byte {
	return []byte("m_" + channel + "_" + strconv.FormatUint(messageID, 10))
}

func timestampKey(channel string, messageID uint64) []byte {
	return []byte("t_" + channel + "_" + strconv.FormatUint(messageID, 10))
}

func counterKey(channel string) []byte {
	return []byte("count_" + channel)
}

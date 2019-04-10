package main

import (
	"encoding/json"
	"strconv"

	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/address"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/env"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(sendMessageToChannel, getMessagesForChannel, getLastMessageIdForChannel)
var SYSTEM = sdk.Export(_init)

var COUNTER_KEY = []byte("count")

type Message struct {
	ID        uint64
	Timestamp uint64
	Author    []byte
	Message   string
}

func _init() {
	state.WriteUint64(COUNTER_KEY, 0)
}

func sendMessageToChannel(channel string, message string) (messageID uint64) {
	messageID = state.ReadUint64(COUNTER_KEY)
	messageID++
	state.WriteUint64(COUNTER_KEY, messageID)
	state.WriteBytes(authorKey(messageID), address.GetSignerAddress())
	state.WriteString(messageKey(messageID), message)
	state.WriteUint64(timestampKey(messageID), env.GetBlockTimestamp())
	return
}

func getMessagesForChannel(channel string, from uint64, to uint64) string {
	lastMessageID := state.ReadUint64(COUNTER_KEY)
	max := to

	if to > lastMessageID {
		max = lastMessageID
	}

	var messages []*Message
	for i := from; i <= max; i++ {
		messages = append(messages, &Message{
			i,
			state.ReadUint64([]byte("t_" + strconv.FormatUint(i, 10))),
			state.ReadBytes([]byte("a_" + strconv.FormatUint(i, 10))),
			state.ReadString([]byte("m_" + strconv.FormatUint(i, 10))),
		})
	}

	data, _ := json.Marshal(messages)
	return string(data)
}

func getLastMessageIdForChannel(channel string) uint64 {
	return state.ReadUint64(COUNTER_KEY)
}

func authorKey(messageID uint64) []byte {
	return []byte("a_" + strconv.FormatUint(messageID, 10))
}

func messageKey(messageID uint64) []byte {
	return []byte("m_" + strconv.FormatUint(messageID, 10))
}

func timestampKey(messageID uint64) []byte {
	return []byte("t_" + strconv.FormatUint(messageID, 10))
}

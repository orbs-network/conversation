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
	count := state.ReadUint64(COUNTER_KEY)
	count++
	state.WriteUint64(COUNTER_KEY, count)
	state.WriteBytes([]byte("a_"+strconv.FormatUint(count, 10)), address.GetSignerAddress())
	state.WriteString([]byte("m_"+strconv.FormatUint(count, 10)), message)
	state.WriteUint64([]byte("t_"+strconv.FormatUint(count, 10)), env.GetBlockTimestamp())
	return count
}

func getMessagesForChannel(channel string, from uint64, to uint64) []byte {
	count := state.ReadUint64(COUNTER_KEY)

	var messages []*Message
	for i := from; i <= to; i++ {
		messages = append(messages, &Message{
			count,
			state.ReadUint64([]byte("t_" + strconv.FormatUint(count, 10))),
			state.ReadBytes([]byte("a_" + strconv.FormatUint(count, 10))),
			state.ReadString([]byte("m_" + strconv.FormatUint(count, 10))),
		})
	}

	data, _ := json.Marshal(messages)
	return data
}

func getLastMessageIdForChannel(channel string) uint64 {
	return state.ReadUint64(COUNTER_KEY)
}

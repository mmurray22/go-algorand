// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v3.20.2
// source: scrooge_message.proto

package scrooge

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	wrapperspb "google.golang.org/protobuf/types/known/wrapperspb"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// This is a one-to-one mapping in the honest case.
// On the case of collision, ignore both messages as sender_id is guaranteed to be valid by TLS
type MessageIdentifier struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// The identity of the cluster this message originated from
	ClusterIdentifier *ClusterIdentifier `protobuf:"bytes,1,opt,name=cluster_identifier,json=clusterIdentifier,proto3" json:"cluster_identifier,omitempty"`
	// The id of the node which sent this message
	SenderId uint64 `protobuf:"varint,2,opt,name=sender_id,json=senderId,proto3" json:"sender_id,omitempty"`
	// This message is the sequence_number-th message sent from one RSM to the next
	SequenceNumber uint64 `protobuf:"varint,3,opt,name=sequence_number,json=sequenceNumber,proto3" json:"sequence_number,omitempty"`
}

func (x *MessageIdentifier) Reset() {
	*x = MessageIdentifier{}
	if protoimpl.UnsafeEnabled {
		mi := &file_scrooge_message_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *MessageIdentifier) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*MessageIdentifier) ProtoMessage() {}

func (x *MessageIdentifier) ProtoReflect() protoreflect.Message {
	mi := &file_scrooge_message_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use MessageIdentifier.ProtoReflect.Descriptor instead.
func (*MessageIdentifier) Descriptor() ([]byte, []int) {
	return file_scrooge_message_proto_rawDescGZIP(), []int{0}
}

func (x *MessageIdentifier) GetClusterIdentifier() *ClusterIdentifier {
	if x != nil {
		return x.ClusterIdentifier
	}
	return nil
}

func (x *MessageIdentifier) GetSenderId() uint64 {
	if x != nil {
		return x.SenderId
	}
	return 0
}

func (x *MessageIdentifier) GetSequenceNumber() uint64 {
	if x != nil {
		return x.SequenceNumber
	}
	return 0
}

// Message data which must be agreed upon by the sending RSM before sending to another RSM
type CrossChainMessageData struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// The data that scrooge intends to transfer from one RSM to another
	MessageContent []byte `protobuf:"bytes,1,opt,name=message_content,json=messageContent,proto3" json:"message_content,omitempty"`
	// This message is the sequence_number-th message sent from one RSM to the next
	SequenceNumber uint64 `protobuf:"varint,3,opt,name=sequence_number,json=sequenceNumber,proto3" json:"sequence_number,omitempty"`
}

func (x *CrossChainMessageData) Reset() {
	*x = CrossChainMessageData{}
	if protoimpl.UnsafeEnabled {
		mi := &file_scrooge_message_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CrossChainMessageData) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CrossChainMessageData) ProtoMessage() {}

func (x *CrossChainMessageData) ProtoReflect() protoreflect.Message {
	mi := &file_scrooge_message_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CrossChainMessageData.ProtoReflect.Descriptor instead.
func (*CrossChainMessageData) Descriptor() ([]byte, []int) {
	return file_scrooge_message_proto_rawDescGZIP(), []int{1}
}

func (x *CrossChainMessageData) GetMessageContent() []byte {
	if x != nil {
		return x.MessageContent
	}
	return nil
}

func (x *CrossChainMessageData) GetSequenceNumber() uint64 {
	if x != nil {
		return x.SequenceNumber
	}
	return 0
}

// Message to hold both the CrossChainMessageData, a proof of its validity, and the current node's ack_count
type CrossChainMessage struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// The data and scrooge book keeping logic needed by scrooge for correctness
	Data *CrossChainMessageData `protobuf:"bytes,1,opt,name=data,proto3" json:"data,omitempty"`
	// A proof that the message contents are valid and signed off by the entire sending RSM
	ValidityProof []byte `protobuf:"bytes,2,opt,name=validity_proof,json=validityProof,proto3" json:"validity_proof,omitempty"`
	// Iff present, the sender of this message preports to have seen messages with:
	// sequence_number in {1,2,..,ack_count} but has not seen `ack_count +1`
	AckCount *wrapperspb.UInt64Value `protobuf:"bytes,3,opt,name=ack_count,json=ackCount,proto3" json:"ack_count,omitempty"`
}

func (x *CrossChainMessage) Reset() {
	*x = CrossChainMessage{}
	if protoimpl.UnsafeEnabled {
		mi := &file_scrooge_message_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *CrossChainMessage) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*CrossChainMessage) ProtoMessage() {}

func (x *CrossChainMessage) ProtoReflect() protoreflect.Message {
	mi := &file_scrooge_message_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use CrossChainMessage.ProtoReflect.Descriptor instead.
func (*CrossChainMessage) Descriptor() ([]byte, []int) {
	return file_scrooge_message_proto_rawDescGZIP(), []int{2}
}

func (x *CrossChainMessage) GetData() *CrossChainMessageData {
	if x != nil {
		return x.Data
	}
	return nil
}

func (x *CrossChainMessage) GetValidityProof() []byte {
	if x != nil {
		return x.ValidityProof
	}
	return nil
}

func (x *CrossChainMessage) GetAckCount() *wrapperspb.UInt64Value {
	if x != nil {
		return x.AckCount
	}
	return nil
}

var File_scrooge_message_proto protoreflect.FileDescriptor

var file_scrooge_message_proto_rawDesc = []byte{
	0x0a, 0x15, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x5f, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67,
	0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x07, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65,
	0x1a, 0x1e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62, 0x75,
	0x66, 0x2f, 0x77, 0x72, 0x61, 0x70, 0x70, 0x65, 0x72, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f,
	0x1a, 0x18, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x5f, 0x6e, 0x65, 0x74, 0x77, 0x6f, 0x72,
	0x6b, 0x69, 0x6e, 0x67, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0xa4, 0x01, 0x0a, 0x11, 0x4d,
	0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x49, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72,
	0x12, 0x49, 0x0a, 0x12, 0x63, 0x6c, 0x75, 0x73, 0x74, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x65, 0x6e,
	0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x73,
	0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x2e, 0x43, 0x6c, 0x75, 0x73, 0x74, 0x65, 0x72, 0x49, 0x64,
	0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x52, 0x11, 0x63, 0x6c, 0x75, 0x73, 0x74, 0x65,
	0x72, 0x49, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x12, 0x1b, 0x0a, 0x09, 0x73,
	0x65, 0x6e, 0x64, 0x65, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x04, 0x52, 0x08,
	0x73, 0x65, 0x6e, 0x64, 0x65, 0x72, 0x49, 0x64, 0x12, 0x27, 0x0a, 0x0f, 0x73, 0x65, 0x71, 0x75,
	0x65, 0x6e, 0x63, 0x65, 0x5f, 0x6e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x04, 0x52, 0x0e, 0x73, 0x65, 0x71, 0x75, 0x65, 0x6e, 0x63, 0x65, 0x4e, 0x75, 0x6d, 0x62, 0x65,
	0x72, 0x22, 0x69, 0x0a, 0x15, 0x43, 0x72, 0x6f, 0x73, 0x73, 0x43, 0x68, 0x61, 0x69, 0x6e, 0x4d,
	0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x44, 0x61, 0x74, 0x61, 0x12, 0x27, 0x0a, 0x0f, 0x6d, 0x65,
	0x73, 0x73, 0x61, 0x67, 0x65, 0x5f, 0x63, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x18, 0x01, 0x20,
	0x01, 0x28, 0x0c, 0x52, 0x0e, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x43, 0x6f, 0x6e, 0x74,
	0x65, 0x6e, 0x74, 0x12, 0x27, 0x0a, 0x0f, 0x73, 0x65, 0x71, 0x75, 0x65, 0x6e, 0x63, 0x65, 0x5f,
	0x6e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x18, 0x03, 0x20, 0x01, 0x28, 0x04, 0x52, 0x0e, 0x73, 0x65,
	0x71, 0x75, 0x65, 0x6e, 0x63, 0x65, 0x4e, 0x75, 0x6d, 0x62, 0x65, 0x72, 0x22, 0xa9, 0x01, 0x0a,
	0x11, 0x43, 0x72, 0x6f, 0x73, 0x73, 0x43, 0x68, 0x61, 0x69, 0x6e, 0x4d, 0x65, 0x73, 0x73, 0x61,
	0x67, 0x65, 0x12, 0x32, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x61, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x1e, 0x2e, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x2e, 0x43, 0x72, 0x6f, 0x73, 0x73,
	0x43, 0x68, 0x61, 0x69, 0x6e, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x44, 0x61, 0x74, 0x61,
	0x52, 0x04, 0x64, 0x61, 0x74, 0x61, 0x12, 0x25, 0x0a, 0x0e, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x69,
	0x74, 0x79, 0x5f, 0x70, 0x72, 0x6f, 0x6f, 0x66, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0c, 0x52, 0x0d,
	0x76, 0x61, 0x6c, 0x69, 0x64, 0x69, 0x74, 0x79, 0x50, 0x72, 0x6f, 0x6f, 0x66, 0x12, 0x39, 0x0a,
	0x09, 0x61, 0x63, 0x6b, 0x5f, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0b,
	0x32, 0x1c, 0x2e, 0x67, 0x6f, 0x6f, 0x67, 0x6c, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x62,
	0x75, 0x66, 0x2e, 0x55, 0x49, 0x6e, 0x74, 0x36, 0x34, 0x56, 0x61, 0x6c, 0x75, 0x65, 0x52, 0x08,
	0x61, 0x63, 0x6b, 0x43, 0x6f, 0x75, 0x6e, 0x74, 0x42, 0x0a, 0x5a, 0x08, 0x2f, 0x73, 0x63, 0x72,
	0x6f, 0x6f, 0x67, 0x65, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_scrooge_message_proto_rawDescOnce sync.Once
	file_scrooge_message_proto_rawDescData = file_scrooge_message_proto_rawDesc
)

func file_scrooge_message_proto_rawDescGZIP() []byte {
	file_scrooge_message_proto_rawDescOnce.Do(func() {
		file_scrooge_message_proto_rawDescData = protoimpl.X.CompressGZIP(file_scrooge_message_proto_rawDescData)
	})
	return file_scrooge_message_proto_rawDescData
}

var file_scrooge_message_proto_msgTypes = make([]protoimpl.MessageInfo, 3)
var file_scrooge_message_proto_goTypes = []interface{}{
	(*MessageIdentifier)(nil),      // 0: scrooge.MessageIdentifier
	(*CrossChainMessageData)(nil),  // 1: scrooge.CrossChainMessageData
	(*CrossChainMessage)(nil),      // 2: scrooge.CrossChainMessage
	(*ClusterIdentifier)(nil),      // 3: scrooge.ClusterIdentifier
	(*wrapperspb.UInt64Value)(nil), // 4: google.protobuf.UInt64Value
}
var file_scrooge_message_proto_depIdxs = []int32{
	3, // 0: scrooge.MessageIdentifier.cluster_identifier:type_name -> scrooge.ClusterIdentifier
	1, // 1: scrooge.CrossChainMessage.data:type_name -> scrooge.CrossChainMessageData
	4, // 2: scrooge.CrossChainMessage.ack_count:type_name -> google.protobuf.UInt64Value
	3, // [3:3] is the sub-list for method output_type
	3, // [3:3] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_scrooge_message_proto_init() }
func file_scrooge_message_proto_init() {
	if File_scrooge_message_proto != nil {
		return
	}
	file_scrooge_networking_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_scrooge_message_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*MessageIdentifier); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_scrooge_message_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CrossChainMessageData); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_scrooge_message_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*CrossChainMessage); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_scrooge_message_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   3,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_scrooge_message_proto_goTypes,
		DependencyIndexes: file_scrooge_message_proto_depIdxs,
		MessageInfos:      file_scrooge_message_proto_msgTypes,
	}.Build()
	File_scrooge_message_proto = out.File
	file_scrooge_message_proto_rawDesc = nil
	file_scrooge_message_proto_goTypes = nil
	file_scrooge_message_proto_depIdxs = nil
}

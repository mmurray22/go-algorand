// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.30.0
// 	protoc        v3.20.2
// source: scrooge_transfer.proto

package scrooge

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// Message with data scrooge sends to appliaction/protocol users
type ScroogeTransfer struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// Types that are assignable to Transfer:
	//
	//	*ScroogeTransfer_UnvalidatedCrossChainMessage
	Transfer isScroogeTransfer_Transfer `protobuf_oneof:"transfer"`
}

func (x *ScroogeTransfer) Reset() {
	*x = ScroogeTransfer{}
	if protoimpl.UnsafeEnabled {
		mi := &file_scrooge_transfer_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ScroogeTransfer) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ScroogeTransfer) ProtoMessage() {}

func (x *ScroogeTransfer) ProtoReflect() protoreflect.Message {
	mi := &file_scrooge_transfer_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ScroogeTransfer.ProtoReflect.Descriptor instead.
func (*ScroogeTransfer) Descriptor() ([]byte, []int) {
	return file_scrooge_transfer_proto_rawDescGZIP(), []int{0}
}

func (m *ScroogeTransfer) GetTransfer() isScroogeTransfer_Transfer {
	if m != nil {
		return m.Transfer
	}
	return nil
}

func (x *ScroogeTransfer) GetUnvalidatedCrossChainMessage() *UnvalidatedCrossChainMessage {
	if x, ok := x.GetTransfer().(*ScroogeTransfer_UnvalidatedCrossChainMessage); ok {
		return x.UnvalidatedCrossChainMessage
	}
	return nil
}

type isScroogeTransfer_Transfer interface {
	isScroogeTransfer_Transfer()
}

type ScroogeTransfer_UnvalidatedCrossChainMessage struct {
	UnvalidatedCrossChainMessage *UnvalidatedCrossChainMessage `protobuf:"bytes,1,opt,name=unvalidated_cross_chain_message,json=unvalidatedCrossChainMessage,proto3,oneof"`
}

func (*ScroogeTransfer_UnvalidatedCrossChainMessage) isScroogeTransfer_Transfer() {}

type UnvalidatedCrossChainMessage struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// An unique identifier used to identify this message
	MessageIdentifier *MessageIdentifier `protobuf:"bytes,1,opt,name=message_identifier,json=messageIdentifier,proto3" json:"message_identifier,omitempty"`
	// The content and scrooge book keeping logic needed by scrooge for correctness
	Data *CrossChainMessageData `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
	// A proof that the message data is valid and signed off by the entire sending RSM
	ValidityProof []byte `protobuf:"bytes,3,opt,name=validity_proof,json=validityProof,proto3" json:"validity_proof,omitempty"`
}

func (x *UnvalidatedCrossChainMessage) Reset() {
	*x = UnvalidatedCrossChainMessage{}
	if protoimpl.UnsafeEnabled {
		mi := &file_scrooge_transfer_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *UnvalidatedCrossChainMessage) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*UnvalidatedCrossChainMessage) ProtoMessage() {}

func (x *UnvalidatedCrossChainMessage) ProtoReflect() protoreflect.Message {
	mi := &file_scrooge_transfer_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use UnvalidatedCrossChainMessage.ProtoReflect.Descriptor instead.
func (*UnvalidatedCrossChainMessage) Descriptor() ([]byte, []int) {
	return file_scrooge_transfer_proto_rawDescGZIP(), []int{1}
}

func (x *UnvalidatedCrossChainMessage) GetMessageIdentifier() *MessageIdentifier {
	if x != nil {
		return x.MessageIdentifier
	}
	return nil
}

func (x *UnvalidatedCrossChainMessage) GetData() *CrossChainMessageData {
	if x != nil {
		return x.Data
	}
	return nil
}

func (x *UnvalidatedCrossChainMessage) GetValidityProof() []byte {
	if x != nil {
		return x.ValidityProof
	}
	return nil
}

var File_scrooge_transfer_proto protoreflect.FileDescriptor

var file_scrooge_transfer_proto_rawDesc = []byte{
	0x0a, 0x16, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x5f, 0x74, 0x72, 0x61, 0x6e, 0x73, 0x66,
	0x65, 0x72, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x07, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67,
	0x65, 0x1a, 0x15, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x5f, 0x6d, 0x65, 0x73, 0x73, 0x61,
	0x67, 0x65, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x8d, 0x01, 0x0a, 0x0f, 0x53, 0x63, 0x72,
	0x6f, 0x6f, 0x67, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x12, 0x6e, 0x0a, 0x1f,
	0x75, 0x6e, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x61, 0x74, 0x65, 0x64, 0x5f, 0x63, 0x72, 0x6f, 0x73,
	0x73, 0x5f, 0x63, 0x68, 0x61, 0x69, 0x6e, 0x5f, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x25, 0x2e, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x2e,
	0x55, 0x6e, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x61, 0x74, 0x65, 0x64, 0x43, 0x72, 0x6f, 0x73, 0x73,
	0x43, 0x68, 0x61, 0x69, 0x6e, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x48, 0x00, 0x52, 0x1c,
	0x75, 0x6e, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x61, 0x74, 0x65, 0x64, 0x43, 0x72, 0x6f, 0x73, 0x73,
	0x43, 0x68, 0x61, 0x69, 0x6e, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x42, 0x0a, 0x0a, 0x08,
	0x74, 0x72, 0x61, 0x6e, 0x73, 0x66, 0x65, 0x72, 0x22, 0xc4, 0x01, 0x0a, 0x1c, 0x55, 0x6e, 0x76,
	0x61, 0x6c, 0x69, 0x64, 0x61, 0x74, 0x65, 0x64, 0x43, 0x72, 0x6f, 0x73, 0x73, 0x43, 0x68, 0x61,
	0x69, 0x6e, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x12, 0x49, 0x0a, 0x12, 0x6d, 0x65, 0x73,
	0x73, 0x61, 0x67, 0x65, 0x5f, 0x69, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65, 0x72, 0x18,
	0x01, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1a, 0x2e, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x2e,
	0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x49, 0x64, 0x65, 0x6e, 0x74, 0x69, 0x66, 0x69, 0x65,
	0x72, 0x52, 0x11, 0x6d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x49, 0x64, 0x65, 0x6e, 0x74, 0x69,
	0x66, 0x69, 0x65, 0x72, 0x12, 0x32, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x61, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1e, 0x2e, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x2e, 0x43, 0x72, 0x6f,
	0x73, 0x73, 0x43, 0x68, 0x61, 0x69, 0x6e, 0x4d, 0x65, 0x73, 0x73, 0x61, 0x67, 0x65, 0x44, 0x61,
	0x74, 0x61, 0x52, 0x04, 0x64, 0x61, 0x74, 0x61, 0x12, 0x25, 0x0a, 0x0e, 0x76, 0x61, 0x6c, 0x69,
	0x64, 0x69, 0x74, 0x79, 0x5f, 0x70, 0x72, 0x6f, 0x6f, 0x66, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0c,
	0x52, 0x0d, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x69, 0x74, 0x79, 0x50, 0x72, 0x6f, 0x6f, 0x66, 0x42,
	0x0a, 0x5a, 0x08, 0x2f, 0x73, 0x63, 0x72, 0x6f, 0x6f, 0x67, 0x65, 0x62, 0x06, 0x70, 0x72, 0x6f,
	0x74, 0x6f, 0x33,
}

var (
	file_scrooge_transfer_proto_rawDescOnce sync.Once
	file_scrooge_transfer_proto_rawDescData = file_scrooge_transfer_proto_rawDesc
)

func file_scrooge_transfer_proto_rawDescGZIP() []byte {
	file_scrooge_transfer_proto_rawDescOnce.Do(func() {
		file_scrooge_transfer_proto_rawDescData = protoimpl.X.CompressGZIP(file_scrooge_transfer_proto_rawDescData)
	})
	return file_scrooge_transfer_proto_rawDescData
}

var file_scrooge_transfer_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_scrooge_transfer_proto_goTypes = []interface{}{
	(*ScroogeTransfer)(nil),              // 0: scrooge.ScroogeTransfer
	(*UnvalidatedCrossChainMessage)(nil), // 1: scrooge.UnvalidatedCrossChainMessage
	(*MessageIdentifier)(nil),            // 2: scrooge.MessageIdentifier
	(*CrossChainMessageData)(nil),        // 3: scrooge.CrossChainMessageData
}
var file_scrooge_transfer_proto_depIdxs = []int32{
	1, // 0: scrooge.ScroogeTransfer.unvalidated_cross_chain_message:type_name -> scrooge.UnvalidatedCrossChainMessage
	2, // 1: scrooge.UnvalidatedCrossChainMessage.message_identifier:type_name -> scrooge.MessageIdentifier
	3, // 2: scrooge.UnvalidatedCrossChainMessage.data:type_name -> scrooge.CrossChainMessageData
	3, // [3:3] is the sub-list for method output_type
	3, // [3:3] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_scrooge_transfer_proto_init() }
func file_scrooge_transfer_proto_init() {
	if File_scrooge_transfer_proto != nil {
		return
	}
	file_scrooge_message_proto_init()
	if !protoimpl.UnsafeEnabled {
		file_scrooge_transfer_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ScroogeTransfer); i {
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
		file_scrooge_transfer_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*UnvalidatedCrossChainMessage); i {
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
	file_scrooge_transfer_proto_msgTypes[0].OneofWrappers = []interface{}{
		(*ScroogeTransfer_UnvalidatedCrossChainMessage)(nil),
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_scrooge_transfer_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_scrooge_transfer_proto_goTypes,
		DependencyIndexes: file_scrooge_transfer_proto_depIdxs,
		MessageInfos:      file_scrooge_transfer_proto_msgTypes,
	}.Build()
	File_scrooge_transfer_proto = out.File
	file_scrooge_transfer_proto_rawDesc = nil
	file_scrooge_transfer_proto_goTypes = nil
	file_scrooge_transfer_proto_depIdxs = nil
}

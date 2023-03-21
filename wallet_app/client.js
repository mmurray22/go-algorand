//import MyAlgoConnect from '@randlabs/myalgo-connect';
//import algosdk from 'algosdk';
const algosdk = require("algosdk");
const MyAlgoConnect = require('@randlabs/myalgo-connect');
const api_token0 = 'b2c3d79ef5621b161ff6bb13ed4d4cf58cc0f0bfac2494db7a1e06cb199d135a';
const server0 = 'http://127.0.0.1';
const port0 = 8080;

const api_token1 = '9c16e8dbd211a5397089c5f05d07d6d003c45349125983b38779549d5dce031e';
const server1 = 'http://127.0.0.1';
const port1 = 36041;


const algodClientNode0 = new algosdk.Algodv2(api_token0, server0, port0);
const algodClientNode1 = new algosdk.Algodv2(api_token1, server1, port1);
const myAlgoConnect = new MyAlgoConnect();
(async () => {
	  console.log(await algodClientNode1.status().do());
	})().catch((e) => {
		console.log(e);
	}
);
(async () => {
	const accountsSharedByUser = await myAlgoConnect.connect();
	const params = await algodClientNode1.getTransactionParams().do();
	//print(params.gensisHash)
	const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
	  suggestedParams: {
		        ...params,
	  },
	  from: 'PNBE4HIZJSAUHCVCTOH7X6YHDNH2DXH6EF5SZCDSMQNBISQ4WI7GZ6HMEE',
	  to: 'LYMCGSOD6IB3GFCMNRQM7NHEJWHW3OW57VP5DJI4UA4LJWTL6JA5FCQEKM',
	  amount: 1000,
	});
	const [ signedTxn ] = await myAlgoConnect.signTxns([{
		  txn: Buffer.from(txn.toByte()).toString('base64')
	}]);
	const txBytes = Buffer.from(signedTxn, 'base64')
	const response = await algodClientNode1.sendRawTransaction(txBytes).do();
	console.log('RESPONSE: ', response)
	// for each node 0..n
})().catch((e) => {
	  console.log(e);
});

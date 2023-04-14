const algosdk = require("algosdk");
const { setMaxIdleHTTPParsers } = require("http");
//const MyAlgoConnect = require('@randlabs/myalgo-connect');
var net = require('net');

async function getLocalAccounts(server, port, kmd_token) {
  const kmdClient = new algosdk.Kmd(kmd_token, server, port);
  console.log('CONSOLE 1.5')
  const kmdVersion = await kmdClient.versions();
  console.log('Version: ', kmdVersion)
  const wallets = await kmdClient.listWallets();
  console.log('CONSOLE 2')
  let walletId;
  // eslint-disable-next-line no-restricted-syntax
  for (const wallet of wallets.wallets) {
    if (wallet.name === 'test_wallet') walletId = wallet.id;
  }

  if (walletId === undefined)
    throw Error('No wallet named: test_wallet');

  const handleResp = await kmdClient.initWalletHandle(walletId, '');
  const handle = handleResp.wallet_handle_token;

  const addresses = await kmdClient.listKeys(handle);
  // eslint-disable-next-line camelcase
  const acctPromises = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const addr of addresses.addresses) {
    acctPromises.push(kmdClient.exportKey(handle, '', addr));
  }
  const keys = await Promise.all(acctPromises);

  // Don't need to wait for it
  kmdClient.releaseWalletHandle(handle);

  return keys.map((k) => {
    const addr = algosdk.encodeAddress(k.private_key.slice(32));
    const acct = { sk: k.private_key, addr };
    const signer = algosdk.makeBasicAccountTransactionSigner(acct);

    return {
      addr: acct.addr,
      privateKey: acct.sk,
      signer,
    };
  });
}

async function algorand_communication() {
    /* Constants necessary to establish connection to the Algorand network/KMD instance */
    const api_token1 = '07a57868eb6a51df4c9bfc2bb2c24093e396f308388e204dda157a3cfa2e6458';
    const kmd_token1 = '180ba7110339b8f21e3324fb74f430930217d13ab9f6f1f128f484d5a5c64b7b';
    const send_acct = 'GEOVLD7STUY5BS2ORLLG5G4IYRN7Y6T2NLDPH2UGD4O4Q26MKAV2ANMLWU'; // Node 1 account
    const receive_acct = 'FUFE2QZC2JDSNS5HX3AQXHOVU5LFKV4HYVCULVZMSLDXFRP7Q76L4OUKM4'; // Node 2 account
    const serverUrl = 'http://127.0.0.1'
    const server1 = '127.0.0.1';
    const algoPort1 = 8080;
    const kmdPort1 = 7833;
    const walletPort = parseInt(process.argv[2]);//1234;
    const clientPort = parseInt(process.argv[3]);//4003; 
    const algorandPort = parseInt(process.argv[4]);//3456;
    const clientServer = process.argv[5]; //'128.110.218.141';
    notes = []
    final_txn = false
    counter = 0
    const algodClientNode1 = new algosdk.Algodv2(api_token1, serverUrl, algoPort1);
    //const myAlgoConnect = new MyAlgoConnect();
    const params = await algodClientNode1.getTransactionParams().do();
    const accounts = await getLocalAccounts(serverUrl, kmdPort1, kmd_token1);
    console.log('Accounts: ', accounts);
    console.log('Done with setup!')


    /****** CLIENT COMMUNICATION CODE  ********/
    /* Server setup */
    var last_tail = "";
    var txns_in_flight = 0;
    var txns_total = 0;
    var server = net.createServer((connection) => { 
	    console.log('client connected');

      /* Executes when new data comes in */
	    connection.on('data', function(data) {
        var txns = []
        var json_arr = data.toString().split('\n');
        // console.log("JSONs: ", json_arr)
        // console.log("Last tail: ", last_tail)
        json_arr[0] = last_tail + json_arr[0]
        // console.log("JSON Arr [0]: ", json_arr[0])
        for (var i = 0; i < json_arr.length - 1; i++) {
          const response = JSON.parse(json_arr[i]);
          if (response.error) {
            console.log("Error: " + response.error.message);
            break
          }
          // console.log("Result: ",  response);
          // notes.push(response.value);
          counter += 1
          // console.log(uint8Array)
          // console.log("Sequence id: ", response.sequence_id)
          const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            suggestedParams: {
              ...params,
            },
            from: send_acct,
            to: receive_acct,
            amount: 100000 + response.sequence_id,
            note: Uint8Array.from(Array.from(response.value).map(letter => letter.charCodeAt(0))) //uint8Array, // TODO: Update values so that you can filll this in!
          });
          /* Get accounts and send transaction */
          const signedTxn = txn.signTxn(accounts[0].privateKey);
          const txBytes = Buffer.from(signedTxn, 'base64')
          txns.push(txBytes)
          // console.log("Counter: ", counter)
          const myPromise = new Promise(async (resolve, reject) => {
            try {
              txns_in_flight += 1
              const result = await algodClientNode1.sendRawTransaction(txBytes).do();
              resolve(result);
              txns_in_flight -= 1
              txns_total += 1
            } catch(err) {
              txns_in_flight -= 1
              console.log("Error: ", err)
            } 
          }).then(result => console.log("Values: ", result) /*result*/)
          .catch(error => console.error("An error occurred: ", error.message));  
        }
        // console.log("EOF Last tail: ", last_tail)
        last_tail = json_arr[json_arr.length - 1]
        // console.log("New last tail: ", last_tail)
        // if (txns.length < )
        // while (txns_in_flight > 10) {
        //   // stall
        // }
        // console.log("Number of txns: ", txns_in_flight)
        // console.log("Txns total processed: ", txns_total)
        // Promise.all(new Array(1).fill(0).map((_, i) => new Promise(async (resolve, reject) => {
        //   try {
        //     txns_in_flight += 1
        //     const result = await algodClientNode1.sendRawTransaction(txns[i]).do();
        //     resolve(result);
        //     txns_in_flight -= 1
        //     txns_total += 1
        //   } catch (error) {
        //     reject(error);
        //     console.log("Transaction: ", txns[i].sequence_id)
        //   }
        // }))).then((values) =>{
        //   console.log("Values: ", values)
        // });
	    });

      /* Reports when it detects the client has ended */
	    connection.on('end', async function() {
		    console.log('client disconnected');    
	    });
    });
    server.on('listening', () => {
      console.log('Server is listening on a port')
    });
    server.listen(walletPort, function() {
	    console.log('server is listening!')
    });


    /* TODO Get response and forward on to the client interface */
    var algorandListener = net.createServer((connection) => {
      connection.on('data', function(data) {
        console.log("Received from algorand: ", data.toString());
        /* TODO: Get the ack from the data */
        const clientSocket = net.createConnection({ host: clientServer, port: clientPort }, () => {
          // console.log('Connected to Client');
          const response = '{"ack_count": 1}';
          // console.log("Response!");
          clientSocket.write(response);
          clientSocket.end();
        });
      });
    });
    algorandListener.on('listening', () => {
      console.log('Algorand listener is listening on a port')
    });
    algorandListener.listen(algorandPort, function() {
	    console.log('Algorand listener is listening!')
    });
    algorandListener.on('end', async function() {
      console.log('Algorand disconnected');    
    });

}
algorand_communication();

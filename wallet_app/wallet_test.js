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

    var algorandListener = net.createServer((connection) => {
      connection.on('data', function(data) {
        console.log("Received from algorand: ", data.toString());
        /* TODO: Get the ack from the data */
        const clientSocket = net.createConnection({ host: clientServer, port: clientPort }, () => {
          console.log('Connected to Client');
          const response = '{"ack_count": 0}';
          console.log("Response!");
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


    /* Server setup */
    var txns_in_flight = 0;
    var txns_total = 0;
	  console.log('client connected');
    var txns = []
    const start = new Date().getTime();
    /* Executes when new data comes in */
    while (new Date().getTime() - start < 1000) { //10 seconds

      /* Create transaction */
      const buffer = new ArrayBuffer(1);
      const uint8Array = new Uint8Array(buffer);
      uint8Array[0] = counter
      counter += 1
      // console.log(uint8Array)
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams: {
          ...params,
        },
        from: send_acct,
        to: receive_acct,
        amount: 100000 + counter,
        note: uint8Array,
      });
      const signedTxn = txn.signTxn(accounts[0].privateKey);
      const txBytes = Buffer.from(signedTxn, 'base64')
      
      console.log("Counter: ", counter)
      console.log("Number of txns: ", txns_in_flight)
      const myPromise = new Promise(async (resolve, reject) => {
        try {
          txns_in_flight += 1
          console.log("In the promise number of txns: ", txns_in_flight)
          const result = await algodClientNode1.sendRawTransaction(txBytes).do();
          // resolve(result);
          txns_in_flight -= 1
          txns_total += 1
          console.log("Result: ", result)
          console.log("~~~~~~~~~Txns total~~~~~~~~~~~~~~~~: ", txns_total)
        } catch (error) {
          reject(error);
          // console.log("Transaction: ", error)
        }
      });
      myPromise
      .then(result => console.log(`The result is ${result}`))
      .catch(error => console.error(`An error occurred: ${error.message}`));
      // Promise.all(new Array(txns.length).fill(0).map((_, i) => new Promise(async (resolve, reject) => {
      //   try {
      //     txns_in_flight += 1
      //     console.log("In the promise number of txns: ", txns_in_flight)
      //     const result = await algodClientNode1.sendRawTransaction(txns[i]).do();
      //     resolve(result);
      //     txns_in_flight -= 1
      //     txns_total += 1
      //   } catch (error) {
      //     reject(error);
      //     // console.log("Transaction: ", txns[i])
      //   }
      // }))).then((values) =>{
      //   console.log("Values: ", values)
      // });
    }
    

    /* TODO Get response and forward on to the client interface */
    

}
algorand_communication();

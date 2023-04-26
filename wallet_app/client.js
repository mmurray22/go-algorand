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

var last_tail = "";
var txns_total = 0;
var promise_list = [];
async function algorand_communication() {
  /* Constants necessary to establish connection to the Algorand network/KMD instance */
  const api_token1 = parsed_data.api_token //'29c99a9a60573ac564b04e0a2024bc3669c9bc6c34b8e9383f0aa36ce070e604';
  const kmd_token1 = parsed_data.kmd_token //'fe489b2aebea68ad37cd1a82ba62ee130e8ec08cfba6e54528d72b7b7440c917';
  const send_acct = parsed_data.send_acct // 'LZ3DICGKHVYFDOBWZOEDK5LLQXMASVFQZWFVS5XPNLH3K7EXZN32OFSOOY'; // Node 1 account
  const receive_acct = parsed_data.receive_acct //'YZPHSOF5UKPGLKEIKV4OMPVRFG24OGSEKM5SBCFW7UU43W5XGZICHPF66Y'; // Node 2 account
  const serverUrl = parsed_data.server_url //'http://127.0.0.1'
  const algoPort1 = parsed_data.algo_port //8080;
  const kmdPort1 = parsed_data.kmd_port //44317; //38897
  const walletPort = parsed_data.wallet_port;//1234;
  const clientPort = parsed_data.client_port;//4003; 
  const algorandPort = parsed_data.algorand_port;//3456;
  const clientIP = parsed_data.client_ip; //'128.110.218.141';
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

  var server = net.createServer((connection) => {
    console.log('client connected');

    /* Executes when new data comes in */
    connection.on('data', async function (data) {
      var txns = []
      var json_arr = data.toString().split('\n');
      // console.log("JSON first: ", json_arr[0])
      // console.log("JSON last: ", json_arr[json_arr.length - 1])
      // console.log("Last tail BEGINNING: ", last_tail)
      json_arr[0] = last_tail + json_arr[0]
      // console.log("NEW JSON Arr [0]: ", json_arr[0])
      last_tail = json_arr[json_arr.length - 1]
      // console.log("New last tail: ", last_tail)
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
        while (promise_list.length >= 1) {
          await promise_list.shift();
        }
        const myPromise = new Promise(async (resolve, reject) => {
          try {
            const result = await algodClientNode1.sendRawTransaction(txBytes).do();
            resolve(result);
            txns_total += 1
          } catch (err) {
            reject(err);
            console.log("Error: ", err)
          }
        }).then(result => console.log("Values: ", result) /*result*/)
          .catch(error => console.error("An error occurred: ", error.message));
        promise_list.push(myPromise);
      }
      // console.log("EOF Last tail: ", last_tail)
      
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
    connection.on('end', async function () {
      console.log('client disconnected');
    });
  });
  server.on('listening', () => {
    console.log('Server is listening on a port')
  });
  server.listen(walletPort, function () {
    console.log('server is listening!')
  });


  /* TODO Get response and forward on to the client interface */
  var algorandListener = net.createServer((connection) => {
    connection.on('data', function (data) {
      console.log("Received from algorand: ", data.toString());
      /* TODO: Get the ack from the data */
      const clientSocket = net.createConnection({ host: clientIP, port: clientPort }, () => {
        // console.log('Connected to Client');
        const response = '{"ack_count": ' + data.toString() + '}';
        // console.log("Response!");
        clientSocket.write(response);
        // clientSocket.end();
      });
    });
  });
  algorandListener.on('listening', () => {
    console.log('Algorand listener is listening on a port')
  });
  algorandListener.listen(algorandPort, function () {
    console.log('Algorand listener is listening!')
  });
  algorandListener.on('end', async function () {
    console.log('Algorand disconnected');
  });

}
algorand_communication();

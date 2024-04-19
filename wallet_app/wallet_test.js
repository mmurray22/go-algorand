const fs = require('fs')
const algosdk = require("algosdk");
const sleep = require('sleep-promise');
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
    if (wallet.name === process.argv[3]) walletId = wallet.id;
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

time_in_confirmation = []
first_start = -1

async function algorand_communication() {
    data = fs.readFileSync(process.argv[2]);
    parsed_data = JSON.parse(data)
    console.log(parsed_data)
    /* Constants necessary to establish connection to the Algorand network/KMD instance */
    const api_token1 = parsed_data.api_token //'29c99a9a60573ac564b04e0a2024bc3669c9bc6c34b8e9383f0aa36ce070e604';
    const kmd_token1 = parsed_data.kmd_token //'fe489b2aebea68ad37cd1a82ba62ee130e8ec08cfba6e54528d72b7b7440c917';
    const send_acct = parsed_data.my_acct // 'LZ3DICGKHVYFDOBWZOEDK5LLQXMASVFQZWFVS5XPNLH3K7EXZN32OFSOOY'; // Node 1 account
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
    const durationToRun = 120000
    const algodClientNode1 = new algosdk.Algodv2(api_token1, serverUrl, algoPort1);
    const accounts = await getLocalAccounts(serverUrl, kmdPort1, kmd_token1);
    console.log('Accounts: ', accounts);
    console.log('Done with setup!')

    /******************************** FIX THE THROUGHPUT MEASUREMENT HERE ************************/
    var algorandListener = net.createServer((connection) => {
      connection.on('data', function (data) {
        //console.log("Received from algorand!!!! ", data.toString());
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
    
    /* Server setup */
    var txns_in_flight = 0;
    var txns_sent = 0;
    var txns_total = 0;
    var promise_list = []
    one_min_tx_total = 0
    two_min_tx_total = 0
    avg_tput = 0
    thirty_secs = 0
    not_thirty = true
    max_rate = 0
    min_rate = 10
    var buffer = new ArrayBuffer(100);
    var uint8Array = new Uint8Array(buffer);
    var status = await algodClientNode1.status().do();
    if (typeof status === 'undefined') {
        throw new Error('Unable to get node status');
    }
    const startRound = status['last-round'];
    if (first_start < 0) {
      console.log("Start Round: ", startRound)
      first_start = startRound
    }
    start = new Date().getTime();
    console.log('Start time: ', start);
    // 2048: MAXIMUM number of requests at any one time
    while (new Date().getTime() - start < durationToRun) { 
      uint8Array[0] = counter
      counter += 1
      var params = await algodClientNode1.getTransactionParams().do();
      params.fee = 10000000
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams: {
          ...params,
        },
        from: send_acct,
        to: receive_acct,
        amount: 100441 + counter,
        note: uint8Array //Uint8Array.from(Array.from(note_str).map(letter => letter.charCodeAt(0)))
      });
      const signedTxn = txn.signTxn(accounts[0].privateKey);
      const txBytes = Buffer.from(signedTxn, 'base64')
      while (txns_in_flight >= 700 /*1000*/ && new Date().getTime() - start < durationToRun) { // Use at maximum a 700 here to account for the maximum size of the transaction
        await promise_list.shift();
      }
      if (new Date().getTime() - start >= durationToRun) {
        break;
      }
      const myPromise = new Promise(async (resolve, reject) => {
        try {
          txns_in_flight += 1
          //console.log("In the promise number of txns: ", txns_in_flight)
          const {txId} = await algodClientNode1.sendRawTransaction(txBytes).do();
          //console.log("Getting here???");
          txns_sent += 1
          // console.log("~~~~~~~~~Txns SENT total~~~~~~~~~~~~~~~~: ", txns_sent)
          // console.log("Txns sent/sec: ", 1000*txns_sent/(new Date().getTime() - start))
          // console.log("Txns in flight sec: ", (new Date().getTime() - start))
          // held_tx = txId
          txns_in_flight -= 1
          // const result = await testWaitForConfirmation(algodClientNode1, txId, 4);
          txns_total += 1
          //console.log("Result: ", result)
          //tODO - uncomment console.log("~~~~~~~~~Txns total~~~~~~~~~~~~~~~~: ", txns_total)
          // console.log("Txns/sec: ", 1000*txns_total/(new Date().getTime() - start))
          // console.log("Number of txn bytes: ", Buffer.byteLength(txBytes))
          // console.log("Txns sent sec: ", (new Date().getTime() - start))
          // if ((new Date().getTime() - start) >= 30000) {
          //   if (not_thirty) {
          //     thirty_secs = txns_total
          //     not_thirty = false
          //   } 
          //   if (max_rate < 1000*txns_total/(new Date().getTime() - start)) {
          //     max_rate = 1000*txns_total/(new Date().getTime() - start)
          //   }
          //   if (min_rate > 1000*txns_total/(new Date().getTime() - start)) {
          //     min_rate = 1000*txns_total/(new Date().getTime() - start)
          //   }
          //   avg_tput += 1000*txns_total/(new Date().getTime() - start)
          //   // console.log("~~~~~~~~~~~~~~AVG Tput over time~~~~~~~~~~~~~~~: ", avg_tput/(txns_total-thirty_secs))
          //   // console.log("~~~~~~~~~~~~~~MAX Tput over time~~~~~~~~~~~~~~~: ", max_rate)
          //   // console.log("~~~~~~~~~~~~~~MIN Tput over time~~~~~~~~~~~~~~~: ", min_rate)
          // }
          resolve(txId)
        } catch (error) {
          console.log("ERROR IN TRANSACTION: ", error/*algodClientNode1.pendingTransactionInformation(held_tx)*/);
          // reject(error);
          txns_in_flight -= 1
        }
      });
      myPromise
      .then(result => {}/*console.log(`The result is ${result}`)*/)
      .catch(error => error(`An error occurred: ${error.message}`));
      promise_list.push(myPromise)
    }
    final_elapsed_time = new Date().getTime() - start
    console.log("~~~~~~~~~Txns total~~~~~~~~~~~~~~~~: ", txns_total)
    console.log("Txns/sec: ", 1000*txns_total/(new Date().getTime() - start))
    console.log("Time spent in confirmation: ", time_in_confirmation.reduce((partialSum, a) => partialSum + a, 0))
    console.log("Txns in flight: ", txns_in_flight);
    var status = await algodClientNode1.status().do();
    if (typeof status === 'undefined') {
        throw new Error('Unable to get node status');
    }
    console.log("Final round: ", status['last-round']);
    console.log("Final txns/sec: ", 1000*(txns_total/final_time))
    console.log("Client ran for the following (ms): ", final_elapsed_time)
    // /* TODO Get response and forward on to the client interface */
    
}
algorand_communication();

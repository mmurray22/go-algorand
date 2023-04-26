const fs = require('fs')
const algosdk = require("algosdk");
const sleep = require('sleep-promise');


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

async function testWaitForConfirmation(client, txid, waitRounds) {
  local_start = new Date().getTime();
  // Wait until the transaction is confirmed or rejected, or until 'waitRounds'
  // number of rounds have passed.
  const status = await client.status().do();
  if (typeof status === 'undefined') {
      throw new Error('Unable to get node status');
  }
  const startRound = status['last-round'];
  console.log("Start Round: ", startRound)
  let currentRound = startRound;
  /* eslint-disable no-await-in-loop */
  while (currentRound < startRound + waitRounds) {
      let poolError = false;
      try {
          const pendingInfo = await client.pendingTransactionInformation(txid).do();
          if (pendingInfo['confirmed-round']) {
              // Got the completed Transaction
              console.log("Time elapsed: ", new Date().getTime() - local_start)
              console.log("Final round: ", pendingInfo['confirmed-round'])
              return pendingInfo;
          }
          if (pendingInfo['pool-error']) {
              // If there was a pool error, then the transaction has been rejected
              poolError = true;
              throw new Error(`Transaction Rejected: ${pendingInfo['pool-error']}`);
          }
      }
      catch (err) {
          // Ignore errors from PendingTransactionInformation, since it may return 404 if the algod
          // instance is behind a load balancer and the request goes to a different algod than the
          // one we submitted the transaction to
          if (poolError) {
              // Rethrow error only if it's because the transaction was rejected
              throw err;
          }
      }
      mini = new Date().getTime();
      await client.statusAfterBlock(currentRound).do();
      console.log("Mini bench of getting status: ", new Date().getTime() - mini)
      currentRound += 1;
  }
  /* eslint-enable no-await-in-loop */
  throw new Error(`Transaction not confirmed after ${waitRounds} rounds`);
}

async function algorand_communication() {
    data = fs.readFileSync(process.argv[2]);
    parsed_data = JSON.parse(data)
    console.log(parsed_data)
    /* Constants necessary to establish connection to the Algorand network/KMD instance */
    const api_token1 = parsed_data.api_token //'29c99a9a60573ac564b04e0a2024bc3669c9bc6c34b8e9383f0aa36ce070e604';
    const kmd_token1 = parsed_data.kmd_token //'fe489b2aebea68ad37cd1a82ba62ee130e8ec08cfba6e54528d72b7b7440c917';
    const send_acct = parsed_data.send_acct // 'LZ3DICGKHVYFDOBWZOEDK5LLQXMASVFQZWFVS5XPNLH3K7EXZN32OFSOOY'; // Node 1 account
    const receive_acct = parsed_data.receive_acct //'YZPHSOF5UKPGLKEIKV4OMPVRFG24OGSEKM5SBCFW7UU43W5XGZICHPF66Y'; // Node 2 account
    const serverUrl = parsed_data.server_url //'http://127.0.0.1'
    const algoPort1 = parsed_data.algo_port //8080;
    const kmdPort1 = parsed_data.kmd_port //44317; //38897
    notes = []
    final_txn = false
    counter = 0
    const algodClientNode1 = new algosdk.Algodv2(api_token1, serverUrl, algoPort1);
    const params = await algodClientNode1.getTransactionParams().do();
    const accounts = await getLocalAccounts(serverUrl, kmdPort1, kmd_token1);
    console.log('Accounts: ', accounts);
    console.log('Done with setup!')


    /* Server setup */
    var txns_in_flight = 0;
    var txns_sent = 0;
    var txns_total = 0;
	  console.log('client connected');
    var promise_list = []
    start = new Date().getTime();
    one_min_tx_total = 0
    two_min_tx_total = 0
    avg_tput = 0
    thirty_secs = 0
    not_thirty = true
    max_rate = 0
    min_rate = 10

     // 2048: MAXIMUM number of requests at any one time
    while (true) { //10 seconds
        if (txns_total > 1) {
            break
        }
        const buffer = new ArrayBuffer(1); // Tested at 1000 so far... [10, 100, 1000, 10000, 100000]
        const uint8Array = new Uint8Array(buffer);
        uint8Array[0] = counter
        counter += 1
        // await sleep(.5);
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            suggestedParams: {
            ...params,
            },
            from: send_acct,
            to: receive_acct,
            amount: 100435 + counter,
            note: uint8Array //Uint8Array.from(Array.from(note_str).map(letter => letter.charCodeAt(0)))
        });
        const signedTxn = txn.signTxn(accounts[0].privateKey);
        const txBytes = Buffer.from(signedTxn, 'base64')
        held_tx = 0
      
        try {
            txns_in_flight += 1
            console.log("In the promise number of txns: ", txns_in_flight)
            const {txId} = await algodClientNode1.sendRawTransaction(txBytes).do();
            txns_sent += 1
            console.log("~~~~~~~~~Txns SENT total~~~~~~~~~~~~~~~~: ", txns_sent)
            // console.log("Txns sent/sec: ", 1000*txns_sent/(new Date().getTime() - start))
            console.log("Txns in flight sec: ", (new Date().getTime() - start))
            held_tx = txId
            const result = await testWaitForConfirmation(algodClientNode1, txId, 4);
            txns_in_flight -= 1
            txns_total += 1
            // console.log("Result: ", result)
            console.log("~~~~~~~~~Txns total~~~~~~~~~~~~~~~~: ", txns_total)
            // console.log("Txns/sec: ", 1000*txns_total/(new Date().getTime() - start))
            console.log("Number of txn bytes: ", Buffer.byteLength(txBytes))
            console.log("Txns sent sec: ", (new Date().getTime() - start))
            if ((new Date().getTime() - start) >= 30000) {
            if (not_thirty) {
                thirty_secs = txns_total
                not_thirty = false
            } 
            if (max_rate < 1000*txns_total/(new Date().getTime() - start)) {
                max_rate = 1000*txns_total/(new Date().getTime() - start)
            }
            if (min_rate > 1000*txns_total/(new Date().getTime() - start)) {
                min_rate = 1000*txns_total/(new Date().getTime() - start)
            }
            avg_tput += 1000*txns_total/(new Date().getTime() - start)
            console.log("~~~~~~~~~~~~~~AVG Tput over time~~~~~~~~~~~~~~~: ", avg_tput/(txns_total-thirty_secs))
            console.log("~~~~~~~~~~~~~~MAX Tput over time~~~~~~~~~~~~~~~: ", max_rate)
            console.log("~~~~~~~~~~~~~~MIN Tput over time~~~~~~~~~~~~~~~: ", min_rate)
            }
        } catch (error) {
            console.log("ERROR IN TRANSACTION: ", error/*algodClientNode1.pendingTransactionInformation(held_tx)*/);
            break
        }
    }
}
algorand_communication();
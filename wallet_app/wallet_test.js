const algosdk = require("algosdk");

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
    if (wallet.name === 'test1') walletId = wallet.id;
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
    const api_token1 = '29c99a9a60573ac564b04e0a2024bc3669c9bc6c34b8e9383f0aa36ce070e604';
    const kmd_token1 = 'fe489b2aebea68ad37cd1a82ba62ee130e8ec08cfba6e54528d72b7b7440c917';
    const send_acct = 'LZ3DICGKHVYFDOBWZOEDK5LLQXMASVFQZWFVS5XPNLH3K7EXZN32OFSOOY'; // Node 1 account
    const receive_acct = 'YZPHSOF5UKPGLKEIKV4OMPVRFG24OGSEKM5SBCFW7UU43W5XGZICHPF66Y'; // Node 2 account
    const serverUrl = 'http://127.0.0.1'
    const algoPort1 = 8080;
    const kmdPort1 = 44317;
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
    var txns_total = 0;
	  console.log('client connected');
    var promise_list = []
    const start = new Date().getTime();
    /* Executes when new data comes in */
    while (true) { //10 seconds

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
        amount: 100030 + counter,
        note: uint8Array,
      });
      const signedTxn = txn.signTxn(accounts[0].privateKey);
      const txBytes = Buffer.from(signedTxn, 'base64')
      held_tx = 0
      while (promise_list.length >= 5000) {
        await promise_list.shift();
      }
      const myPromise = new Promise(async (resolve, reject) => {
        try {

          txns_in_flight += 1
          // console.log("In the promise number of txns: ", txns_in_flight)
          const {txId} = await algodClientNode1.sendRawTransaction(txBytes).do();
          held_tx = txId
          // console.log("Txn id: ", txId)
          const pendingTxns = await algodClientNode1.pendingTransactionsInformation().do();
          // for (var i = 0; i < pendingTxns['top-transactions'].length; i++) {
          //   console.log(pendingTxns['top-transactions'][i])
          // }
          // console.log("Pending trans: ", algodClientNode1.pendingTransactionInformation(txId));
          const result = await algosdk.waitForConfirmation(algodClientNode1, txId, 4);
          
          // console.log(result);
          // console.log(`Transaction Information: ${result.txn}`);
          // console.log(`Decoded Note: ${Buffer.from(result.txn.txn.note).toString()}`);
          resolve(result)
          txns_in_flight -= 1
          txns_total += 1
          // console.log("Result: ", result)
          console.log("~~~~~~~~~Txns total~~~~~~~~~~~~~~~~: ", txns_total)
          console.log("Txns/sec: ", txns_total/(new Date().getTime() - start))
        } catch (error) {
          console.log(algodClientNode1.pendingTransactionInformation(held_tx));
          reject(error);
        }
      });
      myPromise
      .then(result => console.log("") /*console.log(`The result is ${result}`)*/)
      .catch(error => console.error(`An error occurred: ${error.message}`));
      promise_list.push(myPromise)
    }
}
algorand_communication();

//import MyAlgoConnect from '@randlabs/myalgo-connect';
//import algosdk from 'algosdk';
const algosdk = require("algosdk");
const MyAlgoConnect = require('@randlabs/myalgo-connect');
const api_token0 = 'b2c3d79ef5621b161ff6bb13ed4d4cf58cc0f0bfac2494db7a1e06cb199d135a';
const server0 = 'http://127.0.0.1';
const port0 = 8080;

const api_token1 = '9c16e8dbd211a5397089c5f05d07d6d003c45349125983b38779549d5dce031e';
const kmd_token1 = '2e3600bab37616b230116e1fecdbd8d23bfad950e3728448910c7dc62cc26c90';
const server1 = 'http://127.0.0.1';
const port1 = 38665;


const algodClientNode0 = new algosdk.Algodv2(api_token0, server0, port0);
const algodClientNode1 = new algosdk.Algodv2(api_token1, server1, port1);
const myAlgoConnect = new MyAlgoConnect();
(async () => {
	  console.log(await algodClientNode1.status().do());
	})().catch((e) => {
		console.log(e);
	}
);

async function getLocalAccounts(server1, port1) {
  const kmdClient = new algosdk.Kmd(kmd_token1, server1, port1);
  console.log('CONSOLE 1.5')
  const kmdVersion = await kmdClient.versions();
  console.log('Version: ', kmdVersion)
  const wallets = await kmdClient.listWallets();
  console.log('CONSOLE 2')
  let walletId;
  // eslint-disable-next-line no-restricted-syntax
  for (const wallet of wallets.wallets) {
    if (wallet.name === 'unencrypted-default-wallet') walletId = wallet.id;
  }

  if (walletId === undefined)
    throw Error('No wallet named: unencrypted-default-wallet');

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

async function createWallet() {
  // example: KMD_CREATE_CLIENT
  const kmdtoken = 'a'.repeat(64);
  const kmdserver = 'http://localhost';
  const kmdport = 4002;

  const kmdclient = new algosdk.Kmd(kmdtoken, kmdserver, kmdport);
  // example: KMD_CREATE_CLIENT

  // example: KMD_CREATE_WALLET
  const walletName = 'testWallet1';
  const password = 'testpassword';
  // MDK is undefined since we are creating a completely new wallet
  const masterDerivationKey = undefined;
  const driver = 'sqlite';

  const wallet = await kmdclient.createWallet(
    walletName,
    password,
    masterDerivationKey,
    driver
  );
  const walletID = wallet.wallet.id;
  console.log('Created wallet:', walletID);
  // example: KMD_CREATE_WALLET

  // example: KMD_CREATE_ACCOUNT
  // wallet handle is used to establish a session with the wallet
  const wallethandle = (
    await kmdclient.initWalletHandle(walletID, 'testpassword')
  ).wallet_handle_token;
  console.log('Got wallet handle:', wallethandle);

  const { address } = await kmdclient.generateKey(wallethandle);
  console.log('Created new account:', address);
  // example: KMD_CREATE_ACCOUNT

  // example: KMD_EXPORT_ACCOUNT
  const accountKey = await kmdclient.exportKey(wallethandle, password, address);
  const accountMnemonic = algosdk.secretKeyToMnemonic(accountKey.private_key);
  console.log('Account Mnemonic: ', accountMnemonic);
  // example: KMD_EXPORT_ACCOUNT

  // example: KMD_IMPORT_ACCOUNT
  const newAccount = algosdk.generateAccount();
  console.log('Account: ', newAccount.addr);
  const importedAccount = await kmdclient.importKey(
    wallethandle,
    newAccount.sk
  );
  console.log('Account successfully imported: ', importedAccount);
  // example: KMD_IMPORT_ACCOUNT

  // example: KMD_RECOVER_WALLET
  const exportedMDK = (
    await kmdclient.exportMasterDerivationKey(wallethandle, 'testpassword')
  ).master_derivation_key;
  const recoveredWallet = await kmdclient.createWallet(
    'testWallet2',
    'testpassword',
    exportedMDK,
    'sqlite'
  );
  const recoeveredWalletID = recoveredWallet.wallet.id;

  console.log('Created wallet: ', recoeveredWalletID);

  const recoveredWalletHandle = (
    await kmdclient.initWalletHandle(recoeveredWalletID, 'testpassword')
  ).wallet_handle_token;
  console.log('Got wallet handle: ', recoveredWalletHandle);

  const recoveredAddr = (await kmdclient.generateKey(recoveredWalletHandle))
    .address;
  console.log('Recovered account: ', recoveredAddr);
  // example: KMD_RECOVER_WALLET
}

(async () => {
	console.log('Console 1')
	const accounts = await createWallet();
	/*const accounts = await getLocalAccounts(server1, port1);
	console.log('Console 2')
	//const accountsSharedByUser = await myAlgoConnect.connect();
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
	const signedTxn = txn.signTxn(accounts[0].privateKey);
	//const [ signedTxn ] = await myAlgoConnect.signTxns([{
	//	  txn: Buffer.from(txn.toByte()).toString('base64')
	//}]);
	const txBytes = Buffer.from(signedTxn, 'base64')
	const response = await algodClientNode1.sendRawTransaction(txBytes).do();
	console.log('RESPONSE: ', response)*/
})().catch((e) => {
	  console.log(e);
});

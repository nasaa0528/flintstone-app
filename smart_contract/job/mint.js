require('dotenv').config({path:'../.env'})
import contractABI from './contract-abi.json';
import Web3, { providers } from 'web3';
import { createClient } from "redis";
import { getLogger, configure } from "log4js";

import AesEncryption from 'aes-encryption';
const aes = new AesEncryption()
aes.setSecretKey(process.env.AES_SECRET_KEY)
const privateKey = aes.decrypt(process.env.ENC_TEXT)
const httpProvider = process.env.HTTP_PROVIDER || ''

const logger = getLogger();
logger.level = "debug";
configure({
  appenders: { debug: { type: "file", filename: "log-minter.log" } },
  categories: { default: { appenders: ["debug"], level: "debug" } }
});

const web3 = new Web3(new providers.HttpProvider(httpProvider));

const client = createClient();
const JOB_QUEUE = "JOB_QUEUES";
const from = ""

function mint(signedTx) {
	return new Promise(function (resolve, reject) {
		web3.eth.sendSignedTransaction(signedTx.rawTransaction)
			.then(receipt => resolve(receipt))
			.catch(err => {
				logger.debug("Transaction failed: " + err);
				resolve(null)
			});
	});
}

function supply(contract) {
	return new Promise(function (resolve, reject) {
		contract.methods.totalSupply().call()
		.then(function(result){
			resolve(parseInt(result))
		}).catch(err => {
			console.log(err)
			resolve(0)
		})
	});
}


async function startListener() {

	while (true) {
		try {
			var job = await client.lRange(JOB_QUEUE, 0, 0);
			var jobItem = job.toString();
			if(jobItem === ""){
				continue
			}

			var item = JSON.parse(jobItem);
			let contract = new web3.eth.Contract(contractABI, item.contractAddress);
			let totalSupply = await supply(contract);
			let totalRemaining = parseInt(item.supply) - parseInt(totalSupply);
			logger.debug("Job Remaining: ", totalRemaining)
			if(totalRemaining <= 0) {
				await client.lPop(JOB_QUEUE);
				logger.debug("Job Done: ", item.contractAddress)
				continue;
			}

			let mintSize = 50;
			if(totalRemaining < mintSize) {
				mintSize = totalRemaining;
			}

			var signedTx = null;
			const networkId = await web3.eth.net.getId();
			const tx = contract.methods.mint(item.toAddress, mintSize);
			const _gas = await tx.estimateGas({from: from});
			const _gasPrice =  450000000000 //await web3.eth.getGasPrice(); //31000000000 //
			const data = tx.encodeABI();
			const nonce = await web3.eth.getTransactionCount(from);

			signedTx = await web3.eth.accounts.signTransaction(
			{
				to: contract.options.address, 
				data: data,
				gas: _gas,
				gasPrice: _gasPrice,
				nonce: nonce,
				chainId: networkId
			},
				privateKey
			);
			
			if(signedTx) {
				const receipt = await mint(signedTx);
				if(receipt) {
					logger.debug("Transaction receipt: ", receipt.transactionHash)
					await sleep(300000);
				}
			}

		} catch(e) {
			logger.debug("'Job RunTime ERROR: ", e);
		}

		logger.debug("Waiting for next Job");
		await sleep(10000);
	}
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function main() {
	client.on("error", function(error) {
		logger.debug('Redis Error: ', error)
	})
	client.on("ready", () => {
		startListener()
	})

	client.connect();
}

main();

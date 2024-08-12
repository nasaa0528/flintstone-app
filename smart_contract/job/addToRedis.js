import { createClient } from "redis";

const client = createClient();
const JOB_QUEUE = "JOB_QUEUES";
const MINT_ADDRESS = ""

async function addJob(data) {

	for (let i = 0; i < data.length; i++) {
		await client.rPush(JOB_QUEUE, data[i]);
	}

	console.log("-------------------------------------");
	console.log("Exectute Job");
	process.exit(0);
}

function main() {
	
	const data = [{}]
	  

	let list = []
	for (let i = 0; i < data.length; i++) {
		data[i].toAddress = MINT_ADDRESS
		list.push(JSON.stringify(data[i]));
	}

	client.on("error", function(error) {
		console.error('Redis Error: ', error)
	})
	client.on("ready", () => {
		console.log(list);
		addJob(list);
	})

	client.connect();
}

main();

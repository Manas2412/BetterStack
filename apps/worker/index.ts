import axios from "axios";
import { xAckBulk, xReadGroup } from "redis-stream/client";
import { prisma } from "db/client"

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
    throw new Error("Region Id not found");
}
if (!WORKER_ID) {
    throw new Error("Worker Id not found");
}

async function main() {
    while (1) {
        //read from the stream
        const res = await xReadGroup(REGION_ID, WORKER_ID);

        if(!res){
            continue;
        }

        let promises = res.map(({ id, message }) => fetchWebsite(message.url, message.id));
        await Promise.all(promises)

        //process the website and store the result in the db. TODO: It should probably be routed through a queue in a bulk DB request.

        //ack back to the queue that this event has been processed
        xAckBulk(REGION_ID, res.map(({id}) => id));
    }
}

async function fetchWebsite(url: string, websiteId: string) {
    return new Promise<void>((resolve, reject) => {
        let startTime = Date.now();
        axios.get(url)
            .then(async () => {
                const endTime = Date.now();
                await prisma.websiteTick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Up",
                        region_id: REGION_ID,
                        website_id: websiteId
                    }
                })
                resolve();
            })
            .catch(async () => {
                const endTime = Date.now();
                await prisma.websiteTick.create({
                    data: {
                        response_time_ms: endTime - startTime,
                        status: "Down",
                        region_id: REGION_ID,
                        website_id: websiteId
                    }
                })
                resolve();
            })
    })
}

main();
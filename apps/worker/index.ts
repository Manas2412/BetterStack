import axios from "axios";
import { ensureConsumerGroup, xAckBulk, xReadGroup } from "redis-stream/client";
import { prisma } from "db/client";

const REGION_ID = process.env.REGION_ID ?? "dev";
const WORKER_ID = process.env.WORKER_ID ?? "worker1";

const REDIS_RETRY_MS = 5_000;

async function ensureRegionExists(regionId: string) {
    await prisma.region.upsert({
        where: { id: regionId },
        create: { id: regionId, name: regionId },
        update: {},
    });
}

async function main() {
    await ensureRegionExists(REGION_ID);
    for (;;) {
        try {
            await ensureConsumerGroup(REGION_ID);
            break;
        } catch (err) {
            const msg = (err as Error).message ?? String(err);
            if (msg.includes("ECONNREFUSED") || msg.includes("Connection")) {
                console.warn("Waiting for Redis / stream setup... Retrying in", REDIS_RETRY_MS / 1000, "s");
                await sleep(REDIS_RETRY_MS);
            } else {
                throw err;
            }
        }
    }
    while (true) {
        try {
            const res = await xReadGroup(REGION_ID, WORKER_ID);

            if (!res) {
                await sleep(1000);
                continue;
            }

            const promises = res.map(({ id, message }) =>
                fetchWebsite(message.url, message.id)
            );
            await Promise.all(promises);

            await xAckBulk(REGION_ID, res.map((r) => r.id));
        } catch (err) {
            const msg = (err as Error).message ?? String(err);
            if (msg.includes("ECONNREFUSED") || msg.includes("Connection")) {
                console.warn(
                    "Redis unavailable (start Redis with e.g. `redis-server`). Retrying in",
                    REDIS_RETRY_MS / 1000,
                    "s..."
                );
                await sleep(REDIS_RETRY_MS);
            } else if (msg.includes("NOGROUP")) {
                await ensureConsumerGroup(REGION_ID);
                await sleep(1000);
            } else {
                throw err;
            }
        }
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
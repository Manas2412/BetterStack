import { createClient } from "redis";

const REDIS_URL =
  process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

let redisErrorLogged = false;

const client = createClient({ url: REDIS_URL })
  .on("error", (err) => {
    if (redisErrorLogged) return;
    redisErrorLogged = true;
    const msg = (err as Error).message || String(err);
    console.warn(
      "Redis connection error (is Redis running on localhost:6379?):",
      msg || "Connection refused"
    );
  });

// Connect in background so worker can start even when Redis is down
void client.connect().catch(() => {});

type WebsiteEvent = { url: string; id: string };
const STREAM_NAME = "betteruptime:website"
type MessageType = {
  id: string,
    message: {
    url: string,
      id: string
  }
}

export async function xAdd({ url, id }: WebsiteEvent) {
  await client.xAdd(STREAM_NAME, "*", {
    url,
    id,
  });
}

export async function xAddBulk(websites: WebsiteEvent[]) {
  for (const website of websites) {
    await xAdd({
      url: website.url,
      id: website.id,
    });
  }
}

/** Ensures the stream and consumer group exist so XREADGROUP can be used. Idempotent (safe to call on every worker start). */
export async function ensureConsumerGroup(consumerGroup: string): Promise<void> {
  try {
    await client.xGroupCreate(STREAM_NAME, consumerGroup, "0", {
      MKSTREAM: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("BUSYGROUP")) return; // group already exists
    throw err;
  }
}

export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined> {
  const res = await client.xReadGroup(
    consumerGroup,
    workerId,
    {
      key: STREAM_NAME,
      id: '>'
    }, {
    'COUNT': 5
  }
  );

  //@ts-ignore
  let messages: MessageType[] | undefined = res?.[0]?.messages;
  return messages;
}

async function xAck(consumerGroup: string, eventId: string) {
  await client.xAck(STREAM_NAME, consumerGroup, eventId)
}

export async function xAckBulk(
  consumerGroup: string,
  eventIds: string[]
): Promise<void> {
  await Promise.all(eventIds.map((eventId) => xAck(consumerGroup, eventId)));
}
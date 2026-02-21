import "dotenv/config";
import { prisma } from "db/client";
import { xAddBulk } from "redis-stream/client";

async function main() {
  try {
    const websites = await prisma.website.findMany({
      select: {
        url: true,
        id: true,
      },
    });

    await xAddBulk(
      websites.map((w) => ({
        url: w.url,
        id: w.id,
      }))
    );
  } catch (error) {
    console.error("Error in main:", error);
  }
}

setInterval(() => {
  main();
}, 3 * 1000);

import express from "express";
import { prisma } from "db/client";
import { xAdd } from "redis-stream/client";
import { AuthInput } from "./types";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
require("dotenv").config();
import cors from "cors";

const app = express();
app.use(express.json());
app.get("/health", (_req, res) => res.status(200).send("ok"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.post("/website", authMiddleware, async (req, res) => {
  if (!req.body.url) {
    res.status(411).json({});
    return;
  }
  const website = await prisma.website.create({
    data: {
      url: req.body.url,
      timeAdded: new Date(),
      user_id: req.userId!,
    },
  });
  try {
    await xAdd({ url: website.url, id: website.id });
  } catch {
    // Redis down; worker will pick up via pusher when it runs
  }
  res.json({ id: website.id });
});

app.get("/status/:websiteId", authMiddleware, async (req, res) => {
  const website = await prisma.website.findFirst({
    where: {
      user_id: req.userId,
      id: req.params.websiteId as string,
    },
    include: {
      ticks: {
        take: 30,
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  if (!website) {
    res.status(409).json({
      message: "Website not found"
    })
    return;
  }

  res.json({
    website,
  })
});


app.post("/user/sign-up", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: data.data.username,
        password: data.data.password,
      },
    });
    res.json({ id: user.id });
  } catch (err: unknown) {
    const isConflict =
      err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002";
    if (isConflict) {
      res.status(409).json({ message: "Username already taken" });
      return;
    }
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/user/sign-in", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { username: data.data.username },
  });

  if (!user || user.password !== data.data.password) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }

  const token = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET || "secret"
  );

  res.json({ jwt: token });
});

app.get("/websites", authMiddleware, async (req, res) => {
  const websites = await prisma.website.findMany({
    where: {
      user_id: req.userId
    },
    include: {
      ticks: {
        orderBy: [{
          createdAt: 'desc'
        }],
        take: 1
      }
    }
  })

  res.json({
    websites
  })
})

app.listen(process.env.Port || 3002, () => {
  console.log("Api is running on port 3002");
});
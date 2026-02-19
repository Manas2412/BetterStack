import express from "express";
import { prisma } from "db/client";
import { AuthInput } from "./types";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware";
require("dotenv").config();

const app = express();
app.use(express.json());

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
    }
  })
  res.json({
    id: website.id
  });
});

app.get("/status/:websiteId", authMiddleware, (req, res) => {
  const website = prisma.website.findFirst({
    where: {
      user_id: req.userId,
      id: req.params.websiteId,
    },
    include: {
      ticks: {
        take: 10,
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  if(!website){
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
    res.status(403).send("Invalid Input");
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        username: data.data.username,
        password: data.data.password
      }
    });
    res.json({
      id: user.id
    });
  } catch (err) {
    res.status(403).send("Invalid Input");
    return;
  }
});

app.post("/user/sign-in", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    res.status(403).send("Invalid Input");
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      username: data.data.username,
    }
  });

  if (!user || user.password !== data.data.password) {
    res.status(403).send("Invalid Input");
    return;
  }

  const token = jwt.sign({
    sub: user.id
  }, process.env.JWT_SECRET || "secret");

  res.json({
    jwt: token
  });

});

app.get("/websites", authMiddleware, async (req,res) => {
  const websites = await prisma.website.findMany({
    where: {
      user_id: req.userId
    }
  })

  res.json({
    websites
  })
})

app.listen(process.env.Port || 3002, () => {
  console.log("Api is running on port 3002");
});

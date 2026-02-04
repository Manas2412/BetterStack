import express from "express";
import { prisma } from "db/client";

const app = express();
app.use(express.json());

app.post("/website", async (req, res) => {
  if(!req.body.url) {
    res.status(411).json({});
    return;
  }
  const website = await prisma.website.create({
    data: {
      url: req.body.url,
      timeAdded: new Date()
    }
  })
  res.json({
    id: website.id
  });
});

app.post("/status/:websiteId", (req, res) => {
    
});

app.listen(process.env.Port || 3002, () => {
  console.log("Api is running on port 3002");
});

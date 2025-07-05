const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;
const API_BASE = "https://coomer.su/api/v1";

app.use(cors());

function isMp4(filename) {
  return filename && filename.toLowerCase().endsWith(".mp4");
}

async function findCreatorByName(name) {
  const res = await axios.get(`${API_BASE}/creators.txt`);
  const creators = res.data;
  return creators.find(c => c.name.toLowerCase() === name.toLowerCase());
}

async function getAllMp4Files(service, creatorId) {
  let mp4Files = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const res = await axios.get(`${API_BASE}/${service}/user/${creatorId}?o=${offset}`);
    const posts = res.data;

    if (!posts || posts.length === 0) break;

    for (const post of posts) {
      if (post.file && isMp4(post.file.name)) {
        mp4Files.push({
          postId: post.id,
          title: post.title,
          fileName: post.file.name,
          url: `https://coomer.su${post.file.path}`,
          type: "main_file",
        });
      }

      if (post.attachments && post.attachments.length > 0) {
        post.attachments.forEach((att) => {
          if (isMp4(att.name)) {
            mp4Files.push({
              postId: post.id,
              title: post.title,
              fileName: att.name,
              url: `https://coomer.su${att.path}`,
              type: "attachment",
            });
          }
        });
      }
    }

    if (posts.length < limit) break;
    offset += limit;
  }

  return mp4Files;
}

app.get("/creator/Kirawrrra/mp4videos", async (req, res) => {
  try {
    const creatorName = "Kirawrrra";
    const creator = await findCreatorByName(creatorName);
    if(creator){
      console.log("creator found");
    }
    if (!creator) return res.status(404).json({ error: "Creator not found" });

    const mp4Files = await getAllMp4Files(creator.service, creator.id);

    res.json({
      creator: {
        id: creator.id,
        name: creator.name,
        service: creator.service,
      },
      totalMp4Files: mp4Files.length,
      mp4Files,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
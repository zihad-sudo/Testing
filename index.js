import fetch from "node-fetch";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { CONFIG } from "./config.js";

const likesFile = "lastLikes.json";
const MAX_FETCH = 20; // fetch only last 20 likes

async function getLikedTweets() {
  const url = `https://api.twitterapi.io/user/likes?username=${CONFIG.TWITTER_USERNAME}&limit=${MAX_FETCH}`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${CONFIG.TWITTER_API_KEY}` }
  });
  const data = await res.json();
  return data.data || [];
}

async function sendToTelegram(text) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CONFIG.TELEGRAM_CHAT_ID,
      text
    })
  });
}

function loadLastLikes() {
  if (!existsSync(likesFile)) return [];
  return JSON.parse(readFileSync(likesFile, "utf8"));
}

function saveLastLikes(list) {
  writeFileSync(likesFile, JSON.stringify(list));
}

async function main() {
  const prevLikedIds = loadLastLikes();
  const currentLikes = await getLikedTweets();

  const newLikes = currentLikes.filter(t => !prevLikedIds.includes(t.id));

  for (const tweet of newLikes.reverse()) { // reverse: oldest-first for nicer order
    const msg = `❤️ NEW LIKE\n\nUser: ${tweet.author?.username || "unknown"}\n\n${tweet.text || ""}\n\n🔗 https://twitter.com/${tweet.author?.username || "user"}/status/${tweet.id}`;
    await sendToTelegram(msg);
  }

  saveLastLikes(currentLikes.map(t => t.id));
}

main().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});

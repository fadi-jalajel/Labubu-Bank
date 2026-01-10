import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const BASE_URL = "https://bank-app-be-eapi-btf5b.ondigitalocean.app";

const users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));
const txs = JSON.parse(fs.readFileSync("./transactions.json", "utf-8"));

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

async function seed() {
  const userMap = {};

  // 1️⃣ Register + login
  for (const u of users) {
    const displayName = capitalize(u.key);
    const username = `${u.key}__${displayName}`;

    const form = new FormData();
    form.append("username", username);
    form.append("password", "123456");
    form.append("image", fs.createReadStream(`./avatars/${u.key}.png`));

    await axios.post(`${BASE_URL}/api/auth/register`, form, {
      headers: form.getHeaders(),
    });

    // login
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      username,
      password: "123456",
    });

    userMap[u.key] = {
      id: loginRes.data.data.user.id,
      token: loginRes.data.data.token,
    };
  }

  // 2️⃣ Replay transactions
  for (const key in txs) {
    const { token } = userMap[key];
    for (const t of txs[key]) {
      if (t.type === "DEPOSIT") {
        await axios.post(
          `${BASE_URL}/api/transactions/deposit`,
          { amount: t.amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (t.type === "WITHDRAW") {
        await axios.post(
          `${BASE_URL}/api/transactions/withdraw`,
          { amount: t.amount },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (t.type === "TRANSFER") {
        const toUser = userMap[t.to];
        if (!toUser) continue;
        await axios.post(
          `${BASE_URL}/api/transactions/transfer`,
          {
            amount: t.amount,
            toUserId: toUser.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    }
  }

  console.log("🎉 Backend seeded!");
}

seed();

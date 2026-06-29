import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./app/generated/prisma/client";
import bcrypt from "bcrypt";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function seed() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const usersData = [
    { email: "sophie@demo.com", name: "Sophie Martin", username: "sophiemartin", bio: "Photographe ✨ | Paris" },
    { email: "lucas@demo.com", name: "Lucas Bernard", username: "lucas_b", bio: "Voyageur 🌍 | Developer" },
    { email: "emma@demo.com", name: "Emma Dubois", username: "emmadubois", bio: "Foodie 🍕 | Lifestyle" },
  ];

  const hashedPassword = await bcrypt.hash("demo123456", 10);

  const users = await Promise.all(
    usersData.map((u) =>
      db.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, password: hashedPassword },
      })
    )
  );

  console.log(`✅ Created ${users.length} demo users`);

  // Create demo posts
  const postsData = [
    {
      authorId: users[0].id,
      imageUrl: "/post_sunset.jpg",
      caption: "Le coucher de soleil d'hier soir était magique 🌅 #photography #nature #sunset",
    },
    {
      authorId: users[1].id,
      imageUrl: "/post_city.jpg",
      caption: "Tokyo by night... Cette ville ne dort jamais 🌃 #tokyo #travel #nightlife",
    },
    {
      authorId: users[2].id,
      imageUrl: "/post_food.jpg",
      caption: "Sunday brunch goals 🍳☕ Avocado toast + café au lait = bonheur #food #brunch #lifestyle",
    },
  ];

  const posts = await Promise.all(
    postsData.map((p) =>
      db.post.create({ data: p })
    )
  );

  console.log(`✅ Created ${posts.length} demo posts`);

  // Create some likes
  await db.like.createMany({
    data: [
      { userId: users[1].id, postId: posts[0].id },
      { userId: users[2].id, postId: posts[0].id },
      { userId: users[0].id, postId: posts[1].id },
      { userId: users[2].id, postId: posts[1].id },
      { userId: users[0].id, postId: posts[2].id },
      { userId: users[1].id, postId: posts[2].id },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created demo likes");

  // Create some follows
  await db.follow.createMany({
    data: [
      { followerId: users[0].id, followingId: users[1].id },
      { followerId: users[0].id, followingId: users[2].id },
      { followerId: users[1].id, followingId: users[0].id },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created demo follows");

  // Create stories (expire in 24h)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await db.story.createMany({
    data: [
      { userId: users[0].id, imageUrl: "/post_sunset.jpg", expiresAt },
      { userId: users[1].id, imageUrl: "/post_city.jpg", expiresAt },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Created demo stories");
  console.log("\n🎉 Seed complete!");

  await pool.end();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

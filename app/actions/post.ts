"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/app/lib/session";
import { db } from "@/app/lib/db";

export async function toggleLike(postId: string) {
  const session = await getSession();
  if (!session) return;

  const existing = await db.like.findUnique({
    where: { userId_postId: { userId: session.userId, postId } },
  });

  if (existing) {
    await db.like.delete({ where: { id: existing.id } });
  } else {
    await db.like.create({
      data: { userId: session.userId, postId },
    });
  }

  revalidatePath("/");
}

export async function toggleFollow(targetUserId: string) {
  const session = await getSession();
  if (!session) return;
  if (session.userId === targetUserId) return;

  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: { followerId: session.userId, followingId: targetUserId },
    },
  });

  if (existing) {
    await db.follow.delete({ where: { id: existing.id } });
  } else {
    await db.follow.create({
      data: { followerId: session.userId, followingId: targetUserId },
    });
  }

  revalidatePath("/");
}

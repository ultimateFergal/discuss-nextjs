"use server";

import type { Post } from "@prisma/client";
import { db } from "@/db";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import paths from "@/paths";

const createPostSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
});

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  const session = await auth();

  if (!session?.user) {
    return {
      errors: {
        _form: ["You must be signed in to do this"],
      },
    };
  }

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const topic = await db.topic.findFirst({
    where: {
      slug,
    },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Cannot find topic"],
      },
    };
  }

  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        topicId: topic.id,
        userId: session.user.id,
      },
    });
  } catch (error: unknown) {      
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["An unknown error occurred"],
        },
      };
    }
  }

  revalidatePath(paths.topicShow(slug));
  redirect(paths.postShow(slug, post.id));
}

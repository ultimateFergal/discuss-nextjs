import { Suspense } from "react";
import Link from "next/link";
import CommentCreateForm from "@/components/comments/comment-create-form";
import PostShow from "@/components/posts/post-show";
import PostShowLoading from "@/components/posts/post-show-loading";
import paths from "@/paths";
import CommentList from "@/components/comments/comment-list";

interface PostShowPageProps {
  params: Promise<{
    postId: string;
    slug: string;
  }>;
}

export default async function PostShowPage({
  params,
}: Readonly<PostShowPageProps>) {
  const { postId, slug } = await params;

  return (
    <div className="space-y-3">
      <Link className="underline decoration-solid" href={paths.topicShow(slug)}>
        {"<"} Back to {slug}
      </Link>
      <Suspense fallback={<PostShowLoading />}>
        <PostShow postId={postId} />
      </Suspense>
      <CommentCreateForm postId={postId} startOpen />
      <CommentList postId={postId} />
    </div>
  );
}

import CommentCreateForm from "@/components/comments/comment-create-form";
import PostShow from "@/components/posts/post-show";
import paths from "@/paths";
import Link from "next/link";
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
      <PostShow postId={postId} />
      <CommentCreateForm postId={postId} startOpen />
      <CommentList postId={postId} />
    </div>
  );
}

import PostList from "@/components/posts/post-list";
import { fetchPostsBySearchTerm } from "@/db/queries/posts";
import { redirect } from "next/navigation";

interface SearchPageProps {
  searchParams: Promise<{
    term: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: Readonly<SearchPageProps>) {
  const { term } = await searchParams;

  if (!term) {
    redirect("/");
  }

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">Search: {term}</h1>
      <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
    </div>
  );
}

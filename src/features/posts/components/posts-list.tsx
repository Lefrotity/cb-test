import { usePosts } from "../api/get-posts";
import { PostCard } from "./post-card";

export const PostsList = () => {
  const postsQuery = usePosts();

  if (postsQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  const posts = postsQuery.data?.data;

  if (!posts) return null;

  return (
    <div>
      {posts.map(({ id, img, title }) => (
        <PostCard key={id} title={title} img={img} />
      ))}
    </div>
  );
};

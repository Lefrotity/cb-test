import { CreatePost } from "@/features/posts/components/create-post";
import { PostsList } from "@/features/posts/components/posts-list";

export const Home = () => {
  return (
    <div className="w-[600px] m-auto  my-6">
      <h1 className="text-4xl text-center">Посты</h1>
      <CreatePost className="my-3" />
      <PostsList />
    </div>
  );
};

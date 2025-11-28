import { Button } from "@/components/ui/button";
import { CreatePost } from "@/features/posts/components/create-post";
import { PostsList } from "@/features/posts/components/posts-list";

export const Home = () => {
  return (
    <div className="w-[600px] m-auto  my-6">
      <h1 className="text-4xl text-center">Посты</h1>
      <CreatePost trigger={<Button variant="outline">Создать Пост</Button>} />
      <PostsList />
    </div>
  );
};

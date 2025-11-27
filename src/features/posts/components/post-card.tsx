import { Card } from "@/components/ui/card";
import type { Post } from "@/types/api";

type PostCardProps = Pick<Post, "title" | "img">;

export const PostCard = ({ title, img }: PostCardProps) => {
  return (
    <Card
      className={`hover:shadow-md transition-shadow duration-300 px-6 my-4`}
    >
      <div className="flex items-stretch min-h-[120px]">
        <div className="flex-1 p-4 flex flex-col justify-center">
          <h3 className="text-lg font-semibold line-clamp-3 leading-tight">
            {title}
          </h3>
        </div>

        <div className="w-1/3 shrink-0 border-l">
          <img
            src={img}
            alt={`Пост: ${title}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Card>
  );
};

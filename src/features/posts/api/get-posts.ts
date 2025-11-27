import { queryOptions, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Post } from "@/types/api";

export const getPosts = (): Promise<{ data: Post[] }> => {
  return api.get(`/posts`);
};

export const getPostsQueryOptions = () => {
  return queryOptions({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
};

type UsePostsOptions = {
  queryConfig?: QueryConfig<typeof getPostsQueryOptions>;
};

export const usePosts = ({ queryConfig }: UsePostsOptions = {}) => {
  return useQuery({
    ...getPostsQueryOptions(),
    ...queryConfig,
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

import { getPostsQueryOptions } from "./get-posts";

export type CreatePostDTO = {
  title: string;
  img: string;
};

export const createPost = (payload: CreatePostDTO) => {
  return api.post(`/posts`, payload);
};

type UseCreatePostOptions = {
  mutationConfig?: MutationConfig<typeof createPost>;
};

export const useCreatePost = ({
  mutationConfig,
}: UseCreatePostOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getPostsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createPost,
  });
};

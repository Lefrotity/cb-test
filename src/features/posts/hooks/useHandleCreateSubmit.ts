import type { NullableFile } from "@/types/api";
import { imageToBase64FromFile } from "@/utils/imageToBase64FromFile";

import type { UseMutationResult } from "@tanstack/react-query";
import type { CreatePostDTO } from "@/features/posts/api/create-post";
import { useNotification } from "@/hooks/useNotification";

type useHandleCreateSubmitProps = {
  createPostMutation: UseMutationResult<any, Error, CreatePostDTO, unknown>;
};

export const useHandleCreateSubmit = ({
  createPostMutation,
}: useHandleCreateSubmitProps) => {
  const { notify } = useNotification();

  const checkData = ({
    title,
    file,
  }: {
    title: string;
    file: NullableFile;
  }) => {
    return title?.trim()?.length && file;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    file: NullableFile
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("name") as string;

    console.log({ title, file });

    if (!checkData({ title, file })) {
      notify({ text: "Пожалуйста, заполните все поля (название и картинка)" });

      return;
    }

    try {
      const img = await imageToBase64FromFile(file!);

      createPostMutation.mutate({ title, img });
    } catch (err) {
      console.error(err);
    }
  };

  return { handleSubmit };
};

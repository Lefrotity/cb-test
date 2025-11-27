import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SimpleFileUploader } from "@/components/ui/simple-file-uploader";
import { useCreatePost } from "../api/create-post";
import { useState } from "react";
import { useHandleCreateSubmit } from "../hooks/useHandleCreateSubmit";
import type { NullableFile } from "@/types/api";

type CreatePostProps = {
  className?: string;
};

export const CreatePost = ({ className }: CreatePostProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<NullableFile>(null);

  const closeDialog = () => {
    setFile(null);
    setIsOpen(false);
  };

  const handleFileUpload = (uploadedFile: File[]) => {
    setFile(uploadedFile[0]);
  };

  const createPostMutation = useCreatePost({
    mutationConfig: {
      onSuccess: () => {
        console.log("post created");
        closeDialog();
      },
    },
  });

  const { handleSubmit } = useHandleCreateSubmit({ createPostMutation });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          Создать Пост
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => handleSubmit(e, file)}>
          <DialogHeader>
            <DialogTitle className="mb-3">Создание поста</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <Label className="my-3" htmlFor="name-1">
                Название
              </Label>
              <Input id="name-1" name="name" required />
            </div>
          </div>

          <SimpleFileUploader
            className="my-3"
            onFileUpload={handleFileUpload}
            acceptedFileTypes="image/*"
            multiple={false}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Отменить
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createPostMutation.isPending}>
              {createPostMutation.isPending ? "Создание..." : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

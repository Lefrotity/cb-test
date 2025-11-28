import { toast } from "react-toastify";

export type NotifyParams = {
  text: string;
};

export const useNotification = () => {
  const notify = ({ text }: NotifyParams) => {
    toast(text);
  };

  return { notify };
};

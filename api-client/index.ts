import { Message } from "@/pages";

export const getAdventure = async (conversation: Message[]) => {
  const response = await fetch("/api/get-adventure", {
    method: "POST",
    body: JSON.stringify(conversation),
  });
  return response.json();
};

import { Message } from "@/pages";

export const getAdventure = async (conversation: Message[]) => {
  const response = await fetch("/api/get-adventure", {
    method: "POST",
    body: JSON.stringify(conversation),
  });
  return response.json();
};

export const getImage = async (content: string, firstMessage: string) => {
  const response = await fetch("/api/get-image", {
    method: "POST",
    body: JSON.stringify({ content: content, firstMessage: firstMessage }),
  });
  return response.json();
};

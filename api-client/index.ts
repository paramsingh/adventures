import { Message } from "@/pages";

const RETRY_COUNT = 2;
export const getAdventure = async (
  conversation: Message[]
): Promise<Message[]> => {
  for (let i = 0; i < RETRY_COUNT; i++) {
    const response = await fetch("/api/get-adventure", {
      method: "POST",
      body: JSON.stringify(conversation),
    });
    if (response.status === 200) {
      return response.json();
    }
  }

  // if we get here, we've retried and failed
  throw new Error("Something went wrong, please reload :(");
};

export const getImage = async (
  content: string,
  firstMessage: string
): Promise<{ url: string }> => {
  for (let i = 0; i < RETRY_COUNT; i++) {
    const response = await fetch("/api/get-image", {
      method: "POST",
      body: JSON.stringify({ content: content, firstMessage: firstMessage }),
    });
    if (response.status === 200) {
      return response.json();
    }
  }

  // if we get here, we've retried and failed
  throw new Error("Something went wrong, please reload :(");
};

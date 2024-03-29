import { Message } from "@/pages";
import OpenAI from "openai";

export const createCompletion = async (openai: OpenAI, messages: Message[]) => {
  return await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });
};

import { Message } from "@/pages";
import OpenAI from "openai";

export const createCompletion = async (openai: OpenAI, messages: Message[]) => {
  try {
    return await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: messages,
    });
  } catch (err) {
    return await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
  }
};

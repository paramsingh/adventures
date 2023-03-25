import { Configuration, OpenAIApi } from "openai";

export const getOpenAIClient = () => {
  const c = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return new OpenAIApi(c);
};

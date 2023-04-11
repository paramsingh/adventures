import { Configuration, OpenAIApi } from "openai";

export const getOpenAIClient = () => {
  const c = new Configuration({
    apiKey: getOpenAIKey(),
  });
  return new OpenAIApi(c);
};

export const getOpenAIKey = () => {
  return process.env.OPENAI_API_KEY;
};

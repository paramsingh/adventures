import { getOpenAIClient } from "@/utils/get-openai-client";
import { NextApiRequest, NextApiResponse } from "next";
import { OpenAIApi } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
  }
  const openai = getOpenAIClient();
  const data = JSON.parse(req.body);
  const prompt = await getPrompt(openai, data.content, data.firstMessage);
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "256x256",
  });

  if (response.status !== 200) {
    res.status(500).json({ message: "OpenAI error" });
    return;
  }

  res.status(200).json({ url: response.data.data[0].url, prompt });
}

const getPrompt = async (
  openai: OpenAIApi,
  content: string,
  firstMessage: string
) => {
  const PROMPT = `
An example of a Dall-E prompt is: A potato with a cute face and a party hat.

This is the first message of a text-based adventure game.
First Message:
${firstMessage}
=============


This is the current text of the game:
Current Text:
${content}
===========

Use the text to write a small succinct description of the main object of the current text, that can be used as a Dall-E prompt. Write just the description of the current scene, nothing else. Use the first message to set the context if needed.
End your prompt with ", digital art". Remember, you should describe the current text (using the first message to set the context if needed), not the first message itself.
`;
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: PROMPT }],
  });
  return response.data.choices[0].message!.content;
};

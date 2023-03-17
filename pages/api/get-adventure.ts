import type { NextApiRequest, NextApiResponse } from "next";
import { Message } from "..";
import { Configuration, OpenAIApi } from "openai";
import { Content } from "next/font/google";

type Data = {
  conversation: Message[];
};

type Error = {
  message: string;
};

const SYSTEM_PROMPT = `
You are an AI writer that plays text based adventure games with people. Each message you send
contains a prompt for the user to respond to. Each message you send should be in the following format:

Content

Choices

Where Content is the text you want to send to the user and Choices is a list of choices the user can make. 
The choices should always be numbered 1-4.
`;

const PROMPT = `
Play a text based adventure game in the fantasy genre with me set in ancient India. 

Give me 4 choices on what to do. Wait and ask me for what choice I want to make.
Move the story forward according to my choice and give me more choices. 
Repeat this until the game ends. Try to end the game with a reasonable conclusion 
around the time I have made a total 10 choices. Plan your story accordingly.

Make the game as imaginative and compelling as you can.
`;

type Response = Message[] | Error;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const firstMessage: Message = {
    role: "user",
    content: PROMPT,
  };

  const systemMessage: Message = {
    role: "system",
    content: SYSTEM_PROMPT,
  };

  const userConversation = JSON.parse(req.body) as Message[];
  const c = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(c);
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [systemMessage, firstMessage, ...userConversation],
  });
  const answer = completion.data.choices[0].message as Message;
  console.log(answer);
  res.status(200).json([...userConversation, answer]);
}

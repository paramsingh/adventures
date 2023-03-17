import type { NextApiRequest, NextApiResponse } from "next";
import { Message } from "..";
import { Configuration, OpenAIApi } from "openai";

type Error = {
  message: string;
};

const SYSTEM_PROMPT = `
You are an AI writer that plays text based adventure games with people. Be detailed and imaginative
about the setting of the game and the characters in the game. Give the user as many details as possible.
Try to make the story interesting and action-packed from the beginning.

Each message you send contains a prompt for the user to respond to. Each message you send should be in the following format:

{Content}
{Choices}

Where Content is the text you want to send to the user to progress the story
and Choices is a list of choices the user can make. The choices should always be numbered 1-4.
The content should be as detailed as possible.

It is absolutely imperative that you end the story near the 10th choice the user makes.
However, use your best judgement here. Don't compromise the story for the sake of 1 extra prompt.
Just know that the game should NOT go on for more than 15 choices.
`;

const PROMPT = `
Play a text based adventure game with me and try to make it as interesting as possible. The genre of the game
is up to you. Tell me the genre before you start.

Give me 4 choices on what to do. Wait and ask me for what choice I want to make.
Move the story forward according to my choice and give me more choices.
Repeat this until the game ends. Try to end the game with a reasonable conclusion
around the time I have made a total 10 choices. Plan your story accordingly.

Make the game as imaginative and compelling as you can. Now start the game as if I didn't send you this message.
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
  res.status(200).json([...userConversation, answer]);
}

import type { NextApiRequest, NextApiResponse } from "next";
import { Message } from "..";
import { getOpenAIClient } from "@/utils/get-openai-client";
import todaysPrompt from "../../todays-prompt.json";

type Error = {
  message: string;
};

const MAX_MESSAGES_PER_STORY = 6;

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

It is absolutely imperative that you end the story near the ${MAX_MESSAGES_PER_STORY}th choice the user makes.
However, use your best judgement here. Don't compromise the story for the sake of 1 extra prompt.
Just know that the game should NOT go on for more than ${
  MAX_MESSAGES_PER_STORY + 5
} choices. If the story is not finished,
invent a way to end the story by making the main character die.

Once the story is finished, send a message to the user that ends with "The End" in a separate line.
`;

const PROMPT = `
Play a text based adventure game with me and try to make it as interesting as possible. The genre of the story
of the game is ${todaysPrompt.genre}.

Give me 4 choices on what to do. Wait and ask me for what choice I want to make.
Move the story forward according to my choice and give me more choices.
Repeat this until the game ends. Try to end the game with a reasonable conclusion
around the time I have made a total ${MAX_MESSAGES_PER_STORY} choices. Plan your story accordingly.

Make the game as imaginative and compelling as you can. Now start the game as if I didn't send you this message.
Remember, the genre of the story is ${todaysPrompt.genre}.
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

  const data = JSON.parse(req.body);
  const userConversation = data.conversation as Message[];
  const useGPT4 = data.useGPT4 as boolean;
  if (userConversation.length === 0) {
    res.status(200).json([{ role: "assistant", content: getTodaysPrompt() }]);
    return;
  }

  const userConversationWithCounts = userConversation.map((message, index) => {
    if (message.role === "assistant") {
      return message;
    } else {
      const choiceNumber = Math.ceil(index / 2);
      let content = `Choice #${choiceNumber}: ${message.content}. `;
      if (choiceNumber === MAX_MESSAGES_PER_STORY - 2) {
        content += `Let's try to end the story soon.`;
      }

      return {
        role: "user",
        content,
      } as Message;
    }
  });

  const messages = [systemMessage, firstMessage, ...userConversationWithCounts];

  const openai = getOpenAIClient();
  const completion = await openai.createChatCompletion({
    model: useGPT4 ? "gpt-4" : "gpt-3.5-turbo",
    messages: messages,
  });
  if (completion.status !== 200) {
    throw new Error("Something went wrong");
  }
  const answer = completion.data.choices[0].message as Message;

  res.status(200).json([...userConversation, answer]);
}

const getTodaysPrompt = (): string => {
  return todaysPrompt.prompt;
};

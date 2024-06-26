import type { NextApiRequest, NextApiResponse } from "next";
import { Message } from "..";
import { getOpenAIClient } from "@/utils/get-openai-client";
import todaysPrompt from "../../todays-prompt.json";
import { createCompletion } from "@/utils/create-completion";

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


MAKE ABSOLUTELY SURE THAT YOU EXTEND THE STORY BASED ON THE CHOICE I MAKE. DO NOT IGNORE THE CHOICE.

Make the game as imaginative and compelling as you can. Now start the game as if I didn't send you this message.
Remember, the genre of the story is ${todaysPrompt.genre}.
`;

type Response = Message[] | Error;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
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
  if (userConversation.length === 0) {
    res.status(200).json([{ role: "assistant", content: getTodaysPrompt() }]);
    return;
  }

  const userConversationWithCounts = userConversation.map((message, index) => {
    if (message.role === "assistant") {
      return message;
    } else {
      const choiceNumber = Math.ceil(index / 2);
      const prevPrompt = userConversation[index - 1].content;
      const choices = prevPrompt
        .split("\n")
        .filter((line) => line.includes(message.content));
      const choice = choices.length > 0 ? choices[choices.length - 1] : null;
      let content: string;
      if (choice) {
        content = `Choice #${choiceNumber}: I choose ${choice}. `;
      } else {
        content = `Choice #${choiceNumber}: I choose ${message.content}. `;
      }
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
  const completion = await createCompletion(openai, messages);
  if (!completion) {
    throw new Error("Something went wrong");
  }
  const answer = completion.choices[0].message as Message;

  res.status(200).json([...userConversation, answer]);
}

const getTodaysPrompt = (): string => {
  return todaysPrompt.prompt;
};

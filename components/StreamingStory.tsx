import { Message } from "@/pages";
import { useTextBuffer, StreamingText } from "nextjs-openai";
import { useEffect } from "react";

export const StreamingStory = ({
  useGPT4,
  choice,
  conversation,
  onDone,
}: {
  useGPT4: boolean;
  choice: number;
  conversation: Message[];
  onDone: () => void;
}) => {
  const { buffer, refresh, cancel, done } = useTextBuffer({
    url: "/api/get-adventure",
    data: {
      conversation: [
        ...conversation,
        { role: "user", content: choice.toString() },
      ],
      useGPT4,
    },
  });

  useEffect(() => {
    if (done) {
      onDone();
    }
  }, [done]);

  return <StreamingText buffer={buffer} fade={600} />;
};

import { getAdventure } from "@/api-client";
import { Message } from "@/pages";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { StoryMessage } from "./StoryMessage";
import { UserChoice } from "./UserChoice";
import { removeOptionsFromContent } from "@/utils/remove-options-from-content";

export const Button = styled.button`
  margin-right: 10px;
  width: 50px;
`;

export const StoryText = styled.p`
  font-family: "Inconsolata", monospace;
`;

export const Line = styled.hr`
  margin-bottom: 20px;
  margin-top: 20px;
`;

export const Story = ({ useGPT4 }: { useGPT4: boolean }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const [nextOptions, setNextOptions] = useState<(Message[] | undefined)[]>(
    new Array<Message[]>(4)
  );

  const onNewImageLoad = (imageLink: string) => {
    setImageLinks([...imageLinks, imageLink]);
  };

  useEffect(() => {
    setLoading(true);
    getAdventure(conversation, useGPT4)
      .then((data) => {
        setConversation(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setConversation([
          ...conversation,
          {
            role: "system",
            content: "Something went wrong, please reload and try again. :(",
          },
        ]);
      });
  }, []);

  useEffect(() => {
    if (conversation.length === 0) {
      return;
    }

    if (conversation[conversation.length - 1].role !== "assistant") {
      return;
    }

    // prefetch options
    let newArr = new Array<Message[] | undefined>(4);
    setNextOptions(newArr);
    [1, 2, 3, 4].forEach((choice) => {
      getAdventure(
        [...conversation, { role: "user", content: choice.toString() }],
        useGPT4
      ).then((fullConversation) => {
        // if we've moved on ahead in the story, we don't want to update the newArr
        if (conversation.length >= fullConversation.length) {
          return;
        }
        // don't need to setNextOptions(newArr) because nextOptions is a reference
        newArr[choice - 1] = fullConversation;
        setNextOptions(newArr);
      });
    });
  }, [conversation]);

  const choose = (choice: number) => {
    if (
      nextOptions[choice - 1] &&
      conversation.length < nextOptions[choice - 1]!.length
    ) {
      setConversation(nextOptions[choice - 1]!);
      setNextOptions(new Array<Message[] | undefined>(4));
      return;
    }

    setLoading(true);
    getAdventure(
      [...conversation, { role: "user", content: choice.toString() }],
      useGPT4
    ).then((conversation) => {
      setConversation(conversation);
      setLoading(false);

      setNextOptions(new Array<Message[] | undefined>(4));
    });
  };

  let end = false;
  if (conversation.length !== 0) {
    const lastMessage = conversation[conversation.length - 1].content;
    end =
      lastMessage.includes("The End") ||
      lastMessage === "Something went wrong, please reload and try again. :(";
  }

  if (end) {
    const videoData = conversation
      .filter((message) => message.role !== "user")
      .map((message, i) => {
        return {
          text: removeOptionsFromContent(message.content),
          image: imageLinks[i],
        };
      });
    console.log(JSON.stringify(videoData, null, 2));
  }

  return (
    <>
      <Line style={{ marginBottom: "20px", marginTop: "20px" }} />
      {conversation.map((message, index) =>
        renderMessage(message, index, conversation[0].content, onNewImageLoad)
      )}
      {loading && <StoryText>Loading...</StoryText>}
      {!loading && !end && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button onClick={() => choose(1)}>1</Button>
          <Button onClick={() => choose(2)}>2</Button>
          <Button onClick={() => choose(3)}>3</Button>
          <Button onClick={() => choose(4)}>4</Button>
        </div>
      )}
      {end && (
        <StoryText>
          <a
            onClick={() => {
              setConversation(conversation.slice(0, 1));
              setImageLinks([]);
              setNextOptions(new Array<Message[] | undefined>(4));
            }}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Play again?
          </a>
        </StoryText>
      )}
    </>
  );
};

const renderMessage = (
  message: Message,
  index: number,
  firstMessageContent: string,
  onNewImageLoad: (imageLink: string) => void
) => {
  if (message.role == "user") {
    return (
      <div key={`usermessage-${index}`}>
        <UserChoice choice={message.content} />
        <Line />
      </div>
    );
  }
  return (
    <div key={`storymessage-${index}`}>
      <StoryMessage
        firstMessageContent={firstMessageContent}
        content={message.content}
        onImageLoad={onNewImageLoad}
      />
      <Line />
    </div>
  );
};

import { Message } from "@/pages";
import styled from "styled-components";
import { StoryMessage } from "./StoryMessage";
import { UserChoice } from "./UserChoice";

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

export const Story = ({
  conversation,
  loading,
  choose,
}: {
  conversation: Message[];
  loading: boolean;
  choose: (option: number) => void;
}) => {
  let end = false;
  if (conversation.length !== 0) {
    const lastMessage = conversation[conversation.length - 1].content;
    end =
      lastMessage.includes("The End") ||
      lastMessage === "Something went wrong, please reload and try again. :(";
  }

  return (
    <>
      <Line style={{ marginBottom: "20px", marginTop: "20px" }} />
      {conversation.map((message, index) =>
        renderMessage(message, index, conversation[0].content)
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
              window.location.reload();
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
  firstMessageContent: string
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
      />
      <Line />
    </div>
  );
};

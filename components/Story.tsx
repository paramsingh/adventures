import { Message } from "@/pages";
import Link from "next/link";
import styled from "styled-components";

export const Button = styled.button`
  margin-top: 10px;
  margin-right: 10px;
  width: 50px;
`;

export const StoryText = styled.p`
  margin-bottom: 10px;
  margin-top: 10px;
  font-family: "Inconsolata", monospace;
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
  return (
    <>
      <hr style={{ marginBottom: "20px" }} />
      {conversation.map((message) => {
        return (
          <>
            <StoryText>
              {message.role === "user"
                ? `You chose ${message.content.toString()}`
                : message.content}
            </StoryText>
            <hr />
          </>
        );
      })}
      {loading && <StoryText>Loading...</StoryText>}
      {!loading && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button onClick={() => choose(1)}>1</Button>
          <Button onClick={() => choose(2)}>2</Button>
          <Button onClick={() => choose(3)}>3</Button>
          <Button onClick={() => choose(4)}>4</Button>
        </div>
      )}
    </>
  );
};

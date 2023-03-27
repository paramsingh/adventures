import { StoryText } from "./Story";

export const UserChoice = ({ choice }: { choice: string }) => {
  return <StoryText>You chose {choice.toString()}.</StoryText>;
};

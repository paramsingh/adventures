import { getImage } from "@/api-client";
import { useEffect, useState } from "react";
import { StoryText } from "./Story";

export const StoryMessage = ({
  content,
  firstMessage,
}: {
  content: string;
  firstMessage: string;
}) => {
  const [imageURL, setImageURL] = useState<string | null>(null);
  useEffect(() => {
    getImage(content.split("\n")[0], firstMessage.split("\n")[0]).then(
      (data) => {
        setImageURL(data.url);
      }
    );
  }, [content, firstMessage]);
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
      {imageURL && (
        <img
          src={imageURL}
          style={{ marginBottom: "5px", maxHeight: "256px", width: "auto" }}
        />
      )}
      <StoryText>{content}</StoryText>
    </div>
  );
};

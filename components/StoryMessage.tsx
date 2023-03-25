import { getImage } from "@/api-client";
import { useEffect, useState } from "react";
import { StoryText } from "./Story";

export const StoryMessage = ({
  content,
  firstMessageContent,
}: {
  content: string;
  firstMessageContent: string;
}) => {
  const [imageURL, setImageURL] = useState<string | null>(null);

  // this effect gets the image from Dall-E
  useEffect(() => {
    const contentWithoutOptions = removeOptionsFromContent(content);
    const firstMessageWithoutOptions =
      removeOptionsFromContent(firstMessageContent);

    getImage(contentWithoutOptions, firstMessageWithoutOptions).then((data) => {
      setImageURL(data.url);
    });
  }, [content, firstMessageContent]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "15px",
        flexWrap: "wrap",
        marginBottom: "20px",
        justifyContent: "center",
      }}
    >
      {imageURL && (
        <img
          src={imageURL}
          style={{ marginBottom: "5px", maxHeight: "256px", width: "auto" }}
        />
      )}
      <div style={{ maxWidth: "650px" }}>
        <StoryText>{content}</StoryText>
      </div>
    </div>
  );
};

const removeOptionsFromContent = (content: string) => {
  return content.split("\n")[0];
};

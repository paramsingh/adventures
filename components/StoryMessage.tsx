import { getImage } from "@/api-client";
import { useEffect, useState } from "react";
import { StoryText } from "./Story";
import { removeOptionsFromContent } from "@/utils/remove-options-from-content";

export const StoryMessage = ({
  content,
  firstMessageContent,
  onImageLoad,
}: {
  content: string;
  firstMessageContent: string;
  onImageLoad: (imageLink: string) => void;
}) => {
  const [imageURL, setImageURL] = useState<string>("/loading-image.png");
  const [prompt, setPrompt] = useState<string>("loading...");

  // this effect gets the image from Dall-E
  useEffect(() => {
    const contentWithoutOptions = removeOptionsFromContent(content);
    const firstMessageWithoutOptions =
      removeOptionsFromContent(firstMessageContent);

    getImage(contentWithoutOptions, firstMessageWithoutOptions).then((data) => {
      setImageURL(data.url);
      setPrompt(data.prompt);
      onImageLoad(data.url);
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
      <img
        src={imageURL}
        style={{ marginBottom: "5px", maxHeight: "256px", width: "auto" }}
        alt={prompt}
        title={prompt}
      />
      <div style={{ maxWidth: "650px" }}>
        <StoryText>{content}</StoryText>
      </div>
    </div>
  );
};

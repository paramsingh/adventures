export const removeOptionsFromContent = (content: string) => {
  return content.split("\n").slice(0, -4).join("\n");
};

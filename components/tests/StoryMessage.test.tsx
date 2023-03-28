import { render, screen } from "@testing-library/react";
import { StoryMessage } from "../StoryMessage";
import fetchMock from "jest-fetch-mock";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom";

describe("<StoryMessage />", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("should render", () => {
    fetchMock.mockResponseOnce(JSON.stringify({ url: "https://example.com" }));
    act(() => {
      render(
        <StoryMessage
          content="this is the actual message"
          firstMessageContent="this is the first message"
        />
      );
    });

    console.log(screen);
    expect(screen.getByText("this is the actual message")).toBeInTheDocument();
    expect(screen.queryByText("this is the first message")).toBeNull();
  });
});

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { UserChoice } from "../UserChoice";

describe("UserChoice", () => {
  it("should render the component", () => {
    render(<UserChoice choice="1" />);

    expect(screen.getByText("You chose 1.")).toBeInTheDocument();
  });
});

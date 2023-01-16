import { render, screen } from "@testing-library/react"

import { Dummy } from "./Dummy"

it("should render `title` and `children`", () => {
  render(
    <Dummy title="Hi!">
      <p>I'm Dummy!</p>
    </Dummy>
  )

  expect(screen.getByText("Hi!")).toBeInTheDocument()
  expect(screen.getByText("I'm Dummy!")).toBeInTheDocument()
})

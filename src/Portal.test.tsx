import { render } from "@testing-library/react"
import { axe } from "jest-axe"

import { Portal } from "./Portal"

it("should have no a11y violations", async () => {
  const { baseElement } = render(
    <Portal>
      <button>test</button>
    </Portal>
  )

  const results = await axe(baseElement)

  expect(results).toHaveNoViolations()
})

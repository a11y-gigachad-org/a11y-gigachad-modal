import { render, screen, fireEvent } from "@testing-library/react"
import { axe } from "jest-axe"

import { Modal } from "./Modal"

// create react-app root div element so we can assert aria-hidden is true
const root = document.createElement("div")

const onClose = jest.fn()

beforeAll(() => {
  root.id = "root"
  root.dataset.testid = "root"

  document.body.appendChild(root)
})

afterAll(() => {
  document.body.removeChild(root)
})

it("should have no a11y violations", async () => {
  const { baseElement } = render(
    <Modal onClose={onClose} title="Title" description="Description">
      <button type="button" onClick={onClose}>
        test
      </button>
    </Modal>
  )

  const results = await axe(baseElement)

  expect(results).toHaveNoViolations()
})

it("should call onClose when escape or close buttons are pressed", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      <button type="button" onClick={onClose}>
        Save & Close
      </button>
    </Modal>
  )

  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })
  expect(onClose).toHaveBeenCalledTimes(1)

  fireEvent.click(screen.getByText("X"))
  expect(onClose).toHaveBeenCalledTimes(2)

  fireEvent.click(screen.getByText("Save & Close"))
  expect(onClose).toHaveBeenCalledTimes(3)
})

it("modal should have aria roles", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      test
    </Modal>
  )

  expect(screen.getByRole("dialog")).toHaveAccessibleName()
  expect(screen.getByRole("dialog")).toHaveAccessibleDescription()
  expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "title")
  expect(screen.getByRole("dialog")).toHaveAttribute("aria-describedby", "description")
  expect(screen.getByRole("dialog")).toHaveAttribute("aria-hidden", "false")
  expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true")
})

it("should render 3 children", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      <p>test</p>
      <p>test</p>
      <p>test</p>
    </Modal>
  )

  expect(screen.getAllByText("test")).toHaveLength(3)
})

it("close button x icon should have aria-label", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      test
    </Modal>
  )

  expect(screen.getByText("X")).toHaveAccessibleName()
})

it("root app element should have aria-hidden set to true", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      test
    </Modal>
  )

  expect(screen.getByTestId("root")).toHaveAttribute("aria-hidden", "true")
})

it("document body should have `overflow: hidden` - not scrollable", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      test
    </Modal>
  )

  expect(document.body).toHaveStyle("overflow: hidden")
})

it("focus should be trapped in a loop when `Tab` key is continiously pressed", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      <button onClick={onClose}>Close</button>
    </Modal>
  )

  expect(screen.getByText("X")).toHaveFocus()

  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" })

  expect(screen.getByText("Close")).toHaveFocus()

  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" })

  expect(screen.getByText("X")).toHaveFocus()
})

it("should not focus a disabled element and it should be ignored and skipped by `Tab` key", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      <button disabled>Disabled close</button>
      <button>Enabled close</button>
    </Modal>
  )

  expect(screen.getByText("X")).toHaveFocus()

  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" })

  expect(screen.getByText("Disabled close")).not.toHaveFocus()
  expect(screen.getByText("Enabled close")).toHaveFocus()
})

it("should not focus a `tabIndex={-1}` element and it should be ignored and skipped by `Tab` key", () => {
  render(
    <Modal onClose={onClose} title="Title" description="Description">
      <button tabIndex={-1}>Tab Index 0</button>
      <button>Close</button>
    </Modal>
  )

  expect(screen.getByText("X")).toHaveFocus()

  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" })

  expect(screen.getByText("Tab Index 0")).not.toHaveFocus()
  expect(screen.getByText("Close")).toHaveFocus()
})

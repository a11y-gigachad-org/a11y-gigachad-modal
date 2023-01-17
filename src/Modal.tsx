import { useRef, useLayoutEffect, ReactNode } from "react"
import styled from "styled-components"

import { Portal } from "./Portal"

const ModalContainer = styled.div`
  display: grid;
  place-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`

const ModalBody = styled.div`
  position: relative;
  width: 85vw;
  background-color: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  @media screen and (min-width: 48rem) {
    width: 40vw;
  }
`

const IconCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background-color: #fff;
`

export type ModalProps = {
  children: ReactNode
  title: string
  description: string
  onClose: () => void
}

export const Modal = (props: ModalProps): JSX.Element => {
  const { children, onClose, title, description } = props

  const modalRef = useRef<HTMLDivElement | null>(null)

  const restoreElementRef = useRef<HTMLElement | Element | null>(null)

  // credit for the list: https://stackoverflow.com/a/1600194
  type FocusableHTMLElement = HTMLAnchorElement &
    HTMLAreaElement &
    HTMLButtonElement &
    HTMLInputElement &
    HTMLSelectElement &
    HTMLTextAreaElement

  // get all natively focusable elements within the modal and convert them to an array of strings
  const getFocusableElements = (modal: HTMLDivElement): FocusableHTMLElement[] =>
    Array.from(
      modal.querySelectorAll(
        [
          // `disabled` elements can't be filtered out by using `:not([disabled])` so we have to do it via javascript later
          "a[href]:not([tabindex='-1'])",
          "area[href]:not([tabindex='-1'])",
          "button:not([tabindex='-1'])",
          "input:not([tabindex='-1'])",
          "select:not([tabindex='-1'])",
          "textarea:not([tabindex='-1'])",
        ].join(",")
      )
    )

  // filter out all `disabled` elements
  const getEnabledElements = (elements: FocusableHTMLElement[]): FocusableHTMLElement[] =>
    elements.filter((element) => !element.disabled)

  const getSortedByTabIndex = (elements: FocusableHTMLElement[]): FocusableHTMLElement[] =>
    elements.sort(
      // we want to move `tabIndex={0}` to the end of the array. this is what the browser does, as well
      // so the order of focusing should be tabIndex 1 2 3 4 and only then 0
      // natively focusable elements like `button` have implicit tabIndex of 0
      (a, b) =>
        Math.sign((a.tabIndex || Number.MAX_SAFE_INTEGER) - (b.tabIndex || Number.MAX_SAFE_INTEGER))
    )

  const setFocus = (elements: FocusableHTMLElement[], forward = true) => {
    const currentIndex = elements.findIndex((element) => element === document.activeElement)

    let nextIndex = 0

    if (forward) {
      // when tab is pressed, we check if the currently focused element is the last
      // if no, increase `currentIndex` by 1, which focuses the next element
      // if yes, focus the first element
      nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
    } else {
      // when shift + tab is pressed, check if currently focused element is the first
      // if no, decrease `currentIndex` by 1, which focuses the previous element
      // if yes, focus the last element
      nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
    }

    elements[nextIndex].focus()
  }

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          onClose()
          break

        case "Tab":
          // prevents `Tab` default behavior that would otherwise ignore the focus trap
          event.preventDefault()

          // event.shiftKey will be true if shift + tab is pressed
          if (modalRef.current) {
            // first get all focusable elements
            const focusableElements = getFocusableElements(modalRef.current)
            // filter out all disabled elements
            const enabledElements = getEnabledElements(focusableElements)
            // then sort them
            const sortedElements = getSortedByTabIndex(enabledElements)
            // then use them to set next focus
            setFocus(sortedElements, !event.shiftKey)
          }
          break

        default:
          break
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [onClose])

  useLayoutEffect(() => {
    // prevent content behind the modal from scrolling
    document.body.style.overflow = "hidden"
    // makes the root element hidden from assistive technology while the modal is opened
    document.getElementById("root")?.setAttribute("aria-hidden", "true")

    // just before a focusable element within the modal is focused, we store a reference to the
    // element that was focused just before the modal opened. that way we can restore the focus
    // to that element when the modal closes again
    restoreElementRef.current = document.activeElement

    // focus a focusable element when the modal opens
    if (modalRef.current) {
      const focusableElements = getFocusableElements(modalRef.current)

      const enabledElements = getEnabledElements(focusableElements)

      const sortedElements = getSortedByTabIndex(enabledElements)

      setFocus(sortedElements)
    }

    return () => {
      // resets to the its inherited or initial value
      document.body.style.overflow = "unset"

      document.getElementById("root")?.removeAttribute("aria-hidden")

      // restore focus to the element that was focused just before the modal opened
      if (restoreElementRef.current instanceof HTMLElement) {
        restoreElementRef.current.focus()
      }
    }
  }, [])

  return (
    <Portal>
      <ModalContainer
        role="dialog"
        aria-labelledby="title"
        aria-describedby="description"
        aria-modal="true"
        aria-hidden="false"
        ref={modalRef}
      >
        <ModalBody>
          <h2 id="title">{title}</h2>

          <IconCloseButton type="button" onClick={onClose} aria-label="Close dialog">
            X
          </IconCloseButton>

          <p id="description">{description}</p>

          {children}
        </ModalBody>
      </ModalContainer>
    </Portal>
  )
}

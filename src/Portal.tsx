import { Fragment, useRef, useLayoutEffect, ReactNode } from "react"
import { createPortal } from "react-dom"

export type PortalProps = {
  children: ReactNode
}

const Portal = (props: PortalProps): JSX.Element => {
  const { children } = props

  const container = document.createElement("div")

  container.style.position = "relative"
  /** portaled content should get their own stacking context so they don't interfere */
  /** with each other in unexpected ways. one should never find themselves tempted */
  /** to change the zIndex to a value other than "1". */
  container.style.zIndex = "1"

  const containerRef = useRef(container)

  /** rule of thumb is to use `useLayoutEffect` if the effect needs to be synchronous and also */
  /** if there are any direct mutations to the DOM */
  /** since we’re directly mutating the DOM and want the effect to run synchronously before */
  /** the DOM is repainted, we use `useLayoutEffect` instead of `useEffect` here */
  useLayoutEffect(() => {
    const node = containerRef.current

    document.body.appendChild(node)

    /** since we're directly mutating the DOM, we should remove any existing elements during the cleanup process */
    return () => {
      document.body.removeChild(node)
    }
  }, [])

  /** creates a React Portal, placing all children in a separate DOM root node */
  return <Fragment>{createPortal(children, containerRef.current)}</Fragment>
}

export default Portal

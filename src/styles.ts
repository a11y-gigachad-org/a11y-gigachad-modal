import styled from "styled-components"

export const ModalContainer = styled.div`
  display: grid;
  place-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
`

export const ModalBody = styled.div`
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

export const IconCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background-color: #fff;
`

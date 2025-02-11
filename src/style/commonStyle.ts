import styled from "styled-components";

export const Wrapper = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 420px;
  padding: 50px 0;
`

export const Form = styled.form`
  margin: 50px auto 20px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`

export const Title = styled.h1`
  font-size: 42px;
`

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`

export const Switcher = styled.span`
  a {
    color:rgb(28, 146, 224);
    margin-left: 10px;
  }
`
export const Button = styled.span`
  background-color: white;
  color: black;
  width: 100%;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  bprder: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  cursor: pointer;
`
export const Logo = styled.img`
  height: 25px;
  margin-right: 5px;
`
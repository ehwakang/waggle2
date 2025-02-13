import React, { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    // color: red;
  }
  &:focus {
    outline: none;
    border-color: #24a4f2;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0;
  color: #24a4f2;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #24a4f2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitBtn = styled.input`
  background-color: #24a4f2;
  color: white;
  font-weight: 600;
  border-radius: 20px;
  border: none;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
      // setFile(files[0]);
    }
  };

  return (
    <Form>
      <TextArea
        rows={5}
        maxLength={180}
        value={tweet}
        placeholder="What's happening?"
        onChange={onChange}
      />
      <AttachFileButton htmlFor="file">
        {file ? "Photo added ✅" : "Add photo"}
      </AttachFileButton>
      <AttachFileInput
        id="file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
      />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "POST"} />
    </Form>
  );
}

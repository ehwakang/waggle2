import { styled } from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Timeline from "../components/timeline";

export default function Home() {
  const Wrapper = styled.div`
    display: grid;
    gap: 30px;
    grid-template-rows: 1fr 5fr;
    height: 100vh;
    overflow-y: hidden;
  `;

  return (
    <Wrapper>
      <PostTweetForm onClose={() => {}} />
      <Timeline />
    </Wrapper>
  );
}

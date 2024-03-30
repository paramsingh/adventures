import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Story, StoryText } from "@/components/Story";
import styled from "styled-components";

const AlwaysUnderlinedLink = styled.a`
  text-decoration: underline;
`;

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Param&apos;s Adventures</title>
        <meta
          name="description"
          content="adventures every day, infinite zork but with images, by AI"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@500&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <main className={styles.main}>
        <div className={styles.code}>
          {/* TODO: fix this shit */}
          <StoryText>
            Created by{" "}
            <AlwaysUnderlinedLink href="https://twitter.com/iliekcomputers">
              iliekcomputers
            </AlwaysUnderlinedLink>
            . This uses{" "}
            <AlwaysUnderlinedLink href="https://chat.openai.com">
              ChatGPT
            </AlwaysUnderlinedLink>{" "}
            and{" "}
            <AlwaysUnderlinedLink href="https://openai.com/product/dall-e-2">
              Dall-E
            </AlwaysUnderlinedLink>
            .{" "}
            <AlwaysUnderlinedLink href="/about">
              More details
            </AlwaysUnderlinedLink>{" "}
            here. If you like this project, consider helping{" "}
            <AlwaysUnderlinedLink href="https://buymeacoffee.com/blunderfest">
              pay the bills
            </AlwaysUnderlinedLink>
            .
          </StoryText>
          <Story />
        </div>
      </main>
    </>
  );
}

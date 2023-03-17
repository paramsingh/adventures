import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { getAdventure } from "@/api-client";
import Link from "next/link";
import { Story, StoryText } from "@/components/Story";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function Home() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getAdventure(conversation).then((data) => {
      setConversation(data);
      setLoading(false);
    });
  }, []);

  const choose = (choice: number) => {
    setLoading(true);
    getAdventure([
      ...conversation,
      { role: "user", content: choice.toString() },
    ]).then((conversation) => {
      setConversation(conversation);
      setLoading(false);
    });
  };

  return (
    <>
      <Head>
        <title>Text Adventures</title>
        <meta name="description" content="text adventures every day" />
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
          <StoryText style={{ marginBottom: "10px" }}>
            Created by{" "}
            <Link
              href="https://twitter.com/iliekcomputers"
              style={{ textDecoration: "underline" }}
            >
              iliekcomputers
            </Link>
            . This uses{" "}
            <Link
              href="https://chat.openai.com"
              style={{ textDecoration: "underline" }}
            >
              ChatGPT
            </Link>
            .
          </StoryText>
          <Story
            conversation={conversation}
            loading={loading}
            choose={choose}
          />
        </div>
      </main>
    </>
  );
}

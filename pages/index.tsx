import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { getAdventure } from "@/api-client";
import styled from "styled-components";

const Button = styled.button`
  margin-top: 10px;
  margin-right: 10px;
  width: 50px;
`;

const StoryText = styled.p`
  margin-bottom: 10px;
  margin-top: 10px;
  font-family: "Inconsolata", monospace;
`;

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
          {conversation.map((message) => {
            return (
              <>
                <StoryText>
                  {message.role === "user"
                    ? `You chose ${message.content.toString()}`
                    : message.content}
                </StoryText>
                <hr />
              </>
            );
          })}
          {loading && <StoryText>Loading...</StoryText>}
          {!loading && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button onClick={() => choose(1)}>1</Button>
              <Button onClick={() => choose(2)}>2</Button>
              <Button onClick={() => choose(3)}>3</Button>
              <Button onClick={() => choose(4)}>4</Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

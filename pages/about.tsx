import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Line, StoryText } from "@/components/Story";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>Param's Adventures | About</title>
        <meta
          name="description"
          content="adventure games every day, infinite zork with images, by AI"
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
          <StoryText>
            <Link href="/" style={{ textDecoration: "underline" }}>
              Get back to playing.
            </Link>
          </StoryText>
          <Line />
          <StoryText>
            Every day, a new prompt starts the game for everyone. Things diverge
            from there. Your choices define where the story goes.
          </StoryText>
          <StoryText>
            If you find an interesting story, please share it with me on{" "}
            <Link
              href="https://twitter.com/iliekcomputers"
              style={{ textDecoration: "underline" }}
            >
              Twitter
            </Link>
            . If you have requests for particular prompts or stories, let me
            know.
          </StoryText>
          <Line />
        </div>
      </main>
    </>
  );
}

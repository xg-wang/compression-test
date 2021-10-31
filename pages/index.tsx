import Head from "next/head";
import styles from "../styles/Home.module.css";
import CompressionTest from "../components/CompressionTest";

export default function Home() {
  return (
    <>
      <Head>
        <title>Compression Test</title>
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <CompressionTest />
        </main>

        <footer className={styles.footer}>
          <a
            href="https://github.com/xg-wang/compression-test"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/xg-wang/compression-test
          </a>
        </footer>
      </div>
    </>
  );
}

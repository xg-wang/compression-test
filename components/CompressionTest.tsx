import { useEffect, useState } from "react";
import { gzipSync } from "fflate";
import styles from "./CompressionTest.module.css";

interface TestState {
  type: string;
  button: string;
  disabled: boolean;
}

interface TestResult {
  counter: number;
  contentLength: number;
  averageTime: number;
}

function formatResult(result: TestResult): string {
  return `Test ${result.counter}: average time to compress ${
    result.contentLength
  } bytes is ${Number(result.averageTime).toPrecision(4)} ms`;
}

const States: Readonly<Record<"initial" | "pending" | "finished", TestState>> =
  {
    get initial() {
      return {
        type: "start",
        button: "Start",
        disabled: false,
        result: "Start test to see results",
      };
    },
    get pending() {
      return {
        type: "pending",
        button: "Working...",
        disabled: true,
        result: "Compressing payload",
      };
    },
    get finished() {
      return {
        type: "finished",
        button: "Restart",
        disabled: false,
        result: "",
      };
    },
  };

export default function CompressionTest() {
  const [payload, setPayload] = useState("{}");
  const [testState, setTestState] = useState<TestState>(States.initial);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [testRunCounter, setTestRunCounter] = useState<number>(1);

  useEffect(() => {
    if (testState.type !== States.pending.type) {
      return;
    }
    performance.mark(`test-start-${testRunCounter}`);
    const timer = setTimeout(() => {
      let seq = 1;
      const times = 1000;
      while (seq++ <= times) {
        gzipSync(new TextEncoder().encode(payload));
      }
      performance.mark(`test-end-${testRunCounter}`);
      const entry = performance.measure(
        `test-${testRunCounter}`,
        `test-start-${testRunCounter}`,
        `test-end-${testRunCounter}`
      );
      const newHistory = testHistory.concat([
        {
          counter: testRunCounter,
          contentLength: payload.length,
          averageTime: entry.duration / times,
        },
      ]);
      setTestState(States.finished);
      setTestRunCounter(testRunCounter + 1);
      setTestHistory(newHistory);
    }, 1);
    return () => {
      clearTimeout(timer);
    };
  }, [testState, testRunCounter, payload, testHistory]);

  const startTest = () => {
    setTestState(States.pending);
  };

  return (
    <>
      <section className={styles.card}>
        <h2>Test input</h2>
        <form
          onSubmit={(e) => {
            startTest();
            e.preventDefault();
          }}
        >
          <button type="submit" disabled={testState.disabled}>
            Run test
          </button>
          <br />
          <label htmlFor="payload">Payload for compression test: {payload.length} bytes</label>
          <br />
          <textarea
            id="payload"
            name="payload"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            required={true}
            cols={30}
            rows={10}
            disabled={testState.disabled}
          />
        </form>
      </section>

      <section className={styles.card}>
        <h2>Run test</h2>
        <ol>
          {testHistory.map((history, index) => (
            <li key={index}>{formatResult(history)}</li>
          ))}
        </ol>
      </section>
    </>
  );
}

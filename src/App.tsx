import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { BiPause, BiReset } from "react-icons/bi";
import { BsFillPlayFill } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakValue, setBreakValue] = useState(5);
  const [sessionValue, setSessionValue] = useState(25);
  const [sessionMinutes, setSessionMinutes] = useState(sessionValue);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(breakValue);
  const [breakSeconds, setBreakSeconds] = useState(0);

  const audioElement = document.getElementById("beep") as HTMLAudioElement;

  useEffect(() => {
    let secondInterval: number | undefined;
    let breakSecondInterval: number | undefined;

    if (isPlaying && isOnBreak) {
      breakSecondInterval = setInterval(() => {
        setBreakSeconds((prevSecond) => {
          if (prevSecond === 0) {
            setBreakMinutes((prevMinute) => prevMinute - 1);
            return 59;
          } else {
            return prevSecond - 1;
          }
        });
      }, 1000);
    } else {
      if (breakSecondInterval !== undefined) {
        clearInterval(breakSecondInterval);
      }
    }

    if (breakMinutes === 0 && breakSeconds === 0) {
      audioElement.play();
      audioElement.currentTime = 0;

      setTimeout(() => {
        if (isOnBreak) {
          setSessionMinutes(sessionValue);
          setSessionSeconds(0);
          setIsOnBreak(false);
        }
      }, 1000);
    }

    if (isPlaying && !isOnBreak) {
      secondInterval = setInterval(() => {
        setSessionSeconds((prevSecond) => {
          if (prevSecond === 0) {
            setSessionMinutes((prevMinute) => prevMinute - 1);
            return 59;
          } else {
            return prevSecond - 1;
          }
        });
      }, 1000);
    } else {
      if (secondInterval !== undefined) {
        clearInterval(secondInterval);
      }
    }

    if (sessionMinutes === 0 && sessionSeconds === 0) {
      audioElement.play();
      audioElement.currentTime = 0;
      setTimeout(() => {
        if (!isOnBreak) {
          setBreakMinutes(breakValue);
          setBreakSeconds(0);
          setIsOnBreak(true);
        }
      }, 1000);
    }

    return () => {
      clearInterval(secondInterval);
      clearInterval(breakSecondInterval);
    };
  }, [
    isPlaying,
    sessionMinutes,
    sessionSeconds,
    breakMinutes,
    breakSeconds,
    isOnBreak,
    breakValue,
    sessionValue,
  ]);

  const handleBreakDecrement = () => {
    if (!isPlaying && breakValue > 1) {
      setBreakValue((prev) => prev - 1);
      setBreakMinutes((prev) => prev - 1);
    }
  };

  const handleBreakIncrement = () => {
    if (!isPlaying && breakValue < 60) {
      setBreakValue((prev) => prev + 1);
      setBreakMinutes((prev) => prev + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (!isPlaying && sessionValue > 1) {
      setSessionValue((prev) => prev - 1);
      setSessionMinutes((prev) => prev - 1);
    }
  };

  const handleSessionIncrement = () => {
    if (!isPlaying && sessionValue < 60) {
      setSessionValue((prev) => prev + 1);
      setSessionMinutes((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setBreakValue(5);
    setSessionValue(25);
    setSessionMinutes(25);
    setBreakMinutes(5);
    setBreakSeconds(0);
    setSessionSeconds(0);
    setIsOnBreak(false);
    audioElement.pause();
    audioElement.currentTime = 0;
  };

  const handleStartStop = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioElement.pause();
    }
  };

  return (
    <>
      <div className="h-screen" style={{ fontFamily: "orbitron" }}>
        <h1
          className="text-sky-700 text-6xl text-center mt-5"
          style={{ fontFamily: "orbitron-bold" }}
        >
          My 25 + 5 Clock
        </h1>
        <div className=" bg-sky-400 text-sky-100 mx-auto mt-20 flex flex-col items-center gap-4 h-fit w-fit p-10 rounded-xl border-8 border-sky-700">
          <div className="flex flex-row gap-4 items-center">
            <div
              id="break-label"
              className="text-2xl border-2 border-solid rounded-lg p-3 bg-sky-700"
            >
              <h3>Break Length</h3>
              <div className="flex flex-row justify-around">
                <button onClick={handleBreakDecrement} id="break-decrement">
                  <GoChevronDown />
                </button>
                <p id="break-length">{breakValue}</p>
                <button onClick={handleBreakIncrement} id="break-increment">
                  <GoChevronUp />
                </button>
              </div>
            </div>
            <div
              id="session-label"
              className="text-2xl border-2 border-solid rounded-lg p-3 bg-sky-700"
            >
              <h3>Session Length</h3>
              <div className="flex flex-row justify-around">
                <button onClick={handleSessionDecrement} id="session-decrement">
                  <GoChevronDown />
                </button>
                <p id="session-length">{sessionValue}</p>
                <button onClick={handleSessionIncrement} id="session-increment">
                  <GoChevronUp />
                </button>
              </div>
            </div>
          </div>
          <div
            id="timer-label"
            className={`flex flex-col gap-1 items-center text-6xl border-4 border-solid rounded-lg p-5 w-80 h-48 bg-sky-700 mt-2 ${
              (sessionMinutes === 0 && sessionSeconds < 60 && isPlaying) ||
              (breakMinutes === 0 && breakSeconds === 0 && isPlaying)
                ? "text-red-500 border-red-500"
                : ""
            }`}
          >
            {!isOnBreak ? (
              <div className="text-center">
                <h2>Session</h2>
                <div id="time-left">
                  {sessionMinutes < 10 ? "0" + sessionMinutes : sessionMinutes}:
                  {sessionSeconds < 10 ? "0" + sessionSeconds : sessionSeconds}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2>Break</h2>
                <div id="time-left">
                  {breakMinutes < 10 ? "0" + breakMinutes : breakMinutes}:
                  {breakSeconds < 10 ? "0" + breakSeconds : breakSeconds}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-center gap-8 text-sky-100">
            <button
              onClick={handleStartStop}
              id="start_stop"
              className="box-border h-16 w-16 flex justify-center items-center hover:text-sky-700"
            >
              {isPlaying ? (
                <BiPause className="text-6xl" />
              ) : (
                <BsFillPlayFill className="text-5xl" />
              )}
            </button>
            <button
              onClick={handleReset}
              id="reset"
              className="box-border h-16 w-16 flex justify-center items-center hover:text-sky-700"
            >
              <BiReset className="text-4xl" />
            </button>
            <audio
              id="beep"
              preload="auto"
              src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
            ></audio>
          </div>
        </div>
      </div>
    </>
  );
}

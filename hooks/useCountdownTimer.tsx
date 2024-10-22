import React, { useState, useEffect } from "react";

function UseCountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let intervalId: any;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return { padZero, minutes, seconds, setIsRunning, isRunning };
}

function padZero(number: number) {
  return (number < 10 ? "0" : "") + number;
}

export default UseCountdownTimer;

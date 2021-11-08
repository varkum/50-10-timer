import React, { useState, useEffect, useRef } from 'react';
import './App.css';
const WORK = 1; //work time
const BREAK = 1; //break time

//display component
function Display(props) {
  let min = (props.minutes < 10) ? "0" + props.minutes.toString(): props.minutes.toString();
  let sec = (props.seconds < 10) ? "0" + props.seconds.toString(): props.seconds.toString();
 
  return (
    <div className = "display-container">
       <h3>
        {props.mode}
      </h3>
      <h1>
        {min}:{sec}
      </h1>
     
    </div>
  )
}

//alert hook
const useAlert = (url) => {
  const [audio, changeAudio] = useState(new Audio(url));

  const toggle = (mode) => {
    audio.volume = 1;
    audio.play();
    window.alert(mode + " is done!");
  }

  return [toggle]
}

function App() {
  const [min, updateMin] = useState(WORK);
  const [sec, updateSec] = useState(0);
  const [mode, updateMode] = useState('Work');
  const [running, updateRun] = useState(false);
  const [startTime, updateStart] = useState(0);
  const pauseTimeRef = useRef();  //current pause location (time)
  const intervalRef = useRef();
  const pauseRef = useRef(0); //total pauseTime
  const totalTimeRef = useRef(WORK * 60);

  const [toggle] = useAlert("https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg");
  
  useEffect(() => {
      let intervalId;
      if (running) {
      intervalId = setInterval(() => {
        let now = Date.now();
        let remaining = Math.ceil(totalTimeRef.current - ((now - startTime) / 1000) + pauseRef.current);
        let minutes = Math.floor(remaining/60);
        let seconds = remaining % 60;

        intervalRef.current = intervalId;
        //if time up
        if (minutes == 0 && seconds == 0) {
          if (mode == "Work") {
            toggle("Work");
            totalTimeRef.current = BREAK * 60;
            handleReset(BREAK, false);
            updateMode("Break");
          } else {
            toggle("Break");
            totalTimeRef.current = WORK * 60;
            handleReset(WORK, false);
            updateMode("Work");
          }

        } else {
        updateMin(minutes);
        updateSec(seconds);
        }
      }, 500)
      }
      
  return () => {
    clearInterval(intervalId);
  }
}, [running, mode])



  const handleStart = () => {
    updateRun(true);
    if (min == totalTimeRef.current/60 && sec == 0) {
      updateStart(Date.now())
    } else {
      pauseRef.current = pauseRef.current + (Date.now() - pauseTimeRef.current)/1000;
    }
  }
 
  const handleStop = () => {
    updateRun(false);
    pauseTimeRef.current = Date.now();
  }

  const handleReset = (minutes, buttonTrig) => {
    if (buttonTrig) {
    updateRun(false);
    }
    updateStart(Date.now());
    updateMin(minutes);
    updateSec(0);
    totalTimeRef.current = WORK * 60;
    pauseRef.current = 0;
    updateMode("Work");
    clearInterval(intervalRef.current);
  }
  
  return (
    <div className="page-container">
    <div className="timer-container">
      <Display minutes={min} seconds={sec} mode={mode} />
      <div>
        <button onClick = {handleStart}>
          Start
        </button>
        <button onClick = {handleStop}>
          Stop
        </button>
        <button onClick={() => handleReset(WORK, true)}>
          Reset
        </button>
    </div>
    </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
const WORK = 1;
const BREAK = 1;

function Display(props) {
  let min = (props.minutes < 10) ? "0" + props.minutes.toString(): props.minutes.toString();
  let sec = (props.seconds < 10) ? "0" + props.seconds.toString(): props.seconds.toString();
 
  return (
    <div>
       <h3>
        {props.mode}
      </h3>
      <h1>
        {min}:{sec}
      </h1>
     
    </div>
  )
  
  
}

function App() {
  const [min, updateMin] = useState(WORK);
  const [sec, updateSec] = useState(0);
  const [mode, updateMode] = useState('Work');
  const [running, updateRun] = useState(false);
  const [timeRemaining, updateTime] = useState(WORK * 60);
  const [startTime, updateStart] = useState(0);
  const pauseTimeRef = useRef();
  const intervalRef = useRef();
  const pauseRef = useRef(0);
  const totalTimeRef = useRef(WORK * 60);

useEffect(() => {
      let intervalId;
      //SLIGHT ACCELERATION OF CLOCK IN BEGINNING
      if (running) {
      intervalId = setInterval(() => {
        let now = Date.now();
        let remaining = Math.floor(totalTimeRef.current - ((now - startTime) / 1000) + pauseRef.current);
        updateTime(remaining);
        let minutes = Math.floor(remaining/60);
        let seconds = remaining % 60;

        intervalRef.current = intervalId;
        //if time up
        if (minutes == 0 && seconds == 0) {
          if (mode == "Work") {
            
            totalTimeRef.current = BREAK * 60;
            handleReset(BREAK, false);
            updateMode("Break");
            
            
          } else {
            
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
    if (timeRemaining == WORK * 60) {
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
    updateTime(60 * minutes);
    pauseRef.current = 0;
    //clearInterval(intervalRef.current);
  }
  
  
 

  return (
    <div>
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
  );
}

export default App;
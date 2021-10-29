import React, { useState, useEffect } from 'react';
import './App.css';
const WORK = 50;
const BREAK = 10;

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

useEffect(() => {
      if (running) {
        
      setInterval(() => {
        
        let now = Date.now();
        let elapsed = Math.floor((now - startTime) / 1000)
        updateTime(3000 - elapsed);
        let minutes = Math.floor(timeRemaining/60);
        let seconds = timeRemaining % 60;
        console.log(seconds);
        updateMin(minutes);
        updateSec(seconds);
       
      }, 500)
      }
  
}, [running])

  const handleStart = () => {
    updateRun(true);
    if (timeRemaining == WORK * 60) {
      updateStart(Date.now())
    }
  }
  //WHEN I STOP, I NEED TO NOT RESTART. KEEP TRACK OF WHEN YOU STOPPED OR HOW LONG IT HAD BEEN
  const handleStop = () => {
    updateRun(false);
  }

  const handleReset = () => {
    updateMin(50);
    updateSec(0);
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
        <button onClick={handleReset}>
          Reset
        </button>
    </div>
    </div>
  );
}

export default App;
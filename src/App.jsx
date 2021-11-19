import React, { useState, useEffect, useRef } from 'react';
import './App.css';
let WORK = 1; //work time
let BREAK = 1; //break time

//detect click outside hook

const useDetectClick = (ref, changeEdit) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target.value)) {
        changeEdit(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick)
    }
  })
}


//display component
function Display(props) {
   let min = (props.minutes < 10) ? "0" + props.minutes.toString(): props.minutes.toString();
  let sec = (props.seconds < 10) ? "0" + props.seconds.toString(): props.seconds.toString();
  
  const wrapperRef = useRef(null);
  
  const [edit, changeEdit] = useState(false);
  useDetectClick(wrapperRef, changeEdit);
 
 const switchMode = () => {
   if (props.mode == "Work") {
     props.updateMode("Break");
   } else {
     props.updateMode("Work")
   }
 }

const editTimes = () => {
  if(!props.running) {
  changeEdit(!edit)
  }
}

const handleWorkInput = (event) => {
  console.log(event.target.value);
  props.updateWork(event.target.value);
}

const handleBreakInput = (event) => {
  props.updateBreak(event.target.value);
}

const breakEdit = <p>Break:  <input onChange={handleBreakInput} type='number' min="1" placeholder={props.breakTime} /></p>;
const workEdit = <p>Work:  <input onInput={handleWorkInput} type='number' min = "1" placeholder={props.breakTime} /></p>;
  return (
    <div ref={wrapperRef} className = "display-container">
      <div className="mode-container">
        <h3>
          {props.mode}
        </h3>
        <button className="switch-button" onClick={switchMode}>
         <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      
      <div className="disp">
        <h1>{min}:{sec}</h1>
        <button className="switch-button" onClick={editTimes}>
          <i className="fas fa-cog"></i>
        </button>
        <div className="settings">
        {edit && workEdit}
        {edit && breakEdit}
        </div>
      </div>
        
      
      
     
    </div>
  )
}

//alert hook
const useAlert = (url) => {
  const [audio, changeAudio] = useState(new Audio(url));

  const toggle = (mode) => {
    audio.play();
    window.alert(mode + " is done!");
  }

  return [toggle]
}

function App() {
  const [breakTime, updateBreak] = useState(1);
  const [workTime, updateWork] = useState(1);
  
  const [min, updateMin] = useState(workTime);
  const [sec, updateSec] = useState(0);
  const [mode, updateMode] = useState('Work');
  const [running, updateRun] = useState(false);
  const [startTime, updateStart] = useState(0);
  const pauseTimeRef = useRef();  //current pause location (time)
  const intervalRef = useRef();
  const pauseRef = useRef(0); //total pauseTime
  const totalTimeRef = useRef(workTime * 60);

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
            totalTimeRef.current = breakTime * 60;
            handleReset(breakTime, false);
            updateMode("Break");
          } else {
            toggle("Break");
            totalTimeRef.current = workTime * 60;
            handleReset(workTime, false);
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
    if (!running) {
    if (min == totalTimeRef.current/60 && sec == 0) {
      updateStart(Date.now())
    } else {
      pauseRef.current = pauseRef.current + (Date.now() - pauseTimeRef.current)/1000;
    }
    }

    updateRun(true);
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
    totalTimeRef.current = workTime * 60;
    pauseRef.current = 0;
    updateMode("Work");
    clearInterval(intervalRef.current);
  }
  
  

  return (
    <div className="page-container">
    <div className="timer-container">
      <Display minutes={min} seconds={sec} mode={mode} updateMode= {(mode) => updateMode(mode)} updateMin={(min) => updateMin(min)} updateSec={(sec) => updateSec(sec)} running={running} workTime={workTime} breakTime={breakTime} updateWork={(t)=>updateWork(t)} updateBreak={(t)=>updateBreak(t)}/>
      <div>
        <button className="btn" onClick = {handleStart}>
          Start
        </button>
        <button className="btn" onClick = {handleStop}>
          Stop
        </button>
        <button className="btn" onClick={() => handleReset(workTime, true)}>
          Reset
        </button>
    </div>
    </div>
    </div>
  );
}

export default App;
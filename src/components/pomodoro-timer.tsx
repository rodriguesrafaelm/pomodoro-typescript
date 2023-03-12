import React, { useCallback, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Button } from './button';
import { Timer } from './main-timer';
import { secondsToTime, syncLocalStorageValue } from '../utils/seconds-to-time';
import {
  audioClick,
  audioStartWorking,
  audioStopWorking,
} from '../utils/sound-instances';

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props) {
  const pomodorosFromLS = window.localStorage.getItem('pomodoros') || '0';
  const pomodoroStartingValue = parseInt(pomodorosFromLS);
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = React.useState(
    new Array(props.cycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = React.useState(0);
  const [fullWorkingTime, setFullWorkingTime] = React.useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = React.useState(
    pomodoroStartingValue,
  );

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTime,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);

      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }

      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      audioStartWorking,
    ],
  );

  const pauseActions = () => {
    setTimeCounting(!timeCounting);
    audioClick.currentTime = 0;
    audioClick.play();
  };

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');
    if (mainTime > 0) return;
    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length === 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }
    if (working) {
      syncLocalStorageValue(
        setNumberOfPomodoros,
        numberOfPomodoros + 1,
        'pomodoros',
      );
    }
    if (resting) configureWork();
  }, [working, resting, mainTime]);

  return (
    <div className="pomodoro">
      <h2>{working ? 'Focus' : 'Rest'}</h2>
      <Timer mainTimer={mainTime} />
      <h2 className="pause-message">
        {fullWorkingTime && !timeCounting ? 'Paused' : ''}
      </h2>
      <div className="controls">
        <Button
          text="Start"
          className={working ? 'hidden' : ''}
          onClick={() => configureWork()}
        />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'II' : '▷'}
          onClick={() => pauseActions()}
        />
        <Button text="Rest" onClick={() => configureRest(false)} />
      </div>
      <div className="details">
        <p>Completed cycles: {completedCycles}</p>
        <p>Working time: {secondsToTime(fullWorkingTime, 'HM')} </p>
        <p>Pomodoros: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}

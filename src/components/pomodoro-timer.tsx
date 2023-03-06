import React, { useCallback, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Button } from './button';
import { Timer } from './main-timer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import bellStart from '../sounds/src_sounds_bell-start.mp3';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import bellFinish from '../sounds/src_sounds_bell-finish.mp3';
import clickSound from '../sounds/src_sounds_click.mp3';
import { secondsToTime } from '../utils/seconds-to-time';

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);
const audioClick = new Audio(clickSound);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props) {
  const [mainTime, setMainTime] = React.useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [working, setWorking] = React.useState(false);
  const [resting, setResting] = React.useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = React.useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = React.useState(0);
  const [fullWorkingTime, setFullWorkingTime] = React.useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = React.useState(0);

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
      setNumberOfPomodoros(numberOfPomodoros + 1);
    }
    if (resting) configureWork();
  }, [working, resting, mainTime]);

  return (
    <div className="pomodoro">
      <h2>{working ? 'Foco' : 'Descanso'}</h2>
      <Timer mainTimer={mainTime} />
      <h2 className="pause-message">{timeCounting ? '' : 'Timer Parado'}</h2>
      <div className="controls">
        <Button
          text="Iniciar"
          className={working ? 'hidden' : ''}
          onClick={() => configureWork()}
        />
        <Button
          className={!working && !resting ? 'hidden' : ''}
          text={timeCounting ? 'II' : '▷'}
          onClick={() => pauseActions()}
        />
        <Button text="↻" onClick={() => configureRest(false)} />
      </div>
      <div className="details">
        <p>Ciclos Completos: {completedCycles}</p>
        <p>Tempo de trabalho: {secondsToTime(fullWorkingTime, 'HM')} </p>
        <p>Pomodoros concluidos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
}

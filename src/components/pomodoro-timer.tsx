import React, { useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import { Button } from './button';
import { Timer } from './main-timer';

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
  useInterval(
    () => {
      setMainTime(mainTime - 1);
    },
    timeCounting ? 1000 : null,
  );

  useEffect(() => {
    if (working) return document.body.classList.add('working');
    return document.body.classList.remove('working');
  });

  const configureWork = () => {
    setTimeCounting(true);
    setWorking(true);
  };

  const pauseWork = () => {
    setTimeCounting(false);
    setWorking(false);
  };

  return (
    <div className="pomodoro">
      <h2>Working</h2>
      <Timer mainTimer={mainTime} />

      <div className="controls">
        <Button text="Iniciar" onClick={() => configureWork()} />
        <Button text="Reset" onClick={() => console.log('reset')} />
        <Button text="Pausar" onClick={() => pauseWork()} />
      </div>
      <div className="details">
        <p>Testando: asldçaksdjçaksj çaksdjçksa djçkas</p>
        <p>Testando: asldçaksdjçaksj çaksdjçksa djçkas</p>
        <p>Testando: asldçaksdjçaksj çaksdjçksa djçkas</p>
        <p>Testando: asldçaksdjçaksj çaksdjçksa djçkas</p>
      </div>
    </div>
  );
}

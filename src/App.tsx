import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

function App(): JSX.Element {
  return (
    <div className="container">
      <PomodoroTimer
        pomodoroTime={500}
        shortRestTime={50}
        longRestTime={100}
        cycles={0}
      />
    </div>
  );
}

export default App;

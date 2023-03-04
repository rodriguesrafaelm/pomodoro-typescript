export function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes =
    Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0') + 'm';
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0') + 's';

  if (hours > 0) {
    const formatedHours = hours.toString().padStart(2, '0') + 'h';
    return `${formatedHours} ${minutes} ${remainingSeconds}`;
  } else {
    return `${minutes} ${remainingSeconds}`;
  }
}

export function secondsToTime(totalSeconds: number, pattern: string): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatedHours = hours ? hours.toString().padStart(2, '0') + 'h ' : '';
  const formatedMins = minutes.toString().padStart(2, '0') + 'm ';
  const formatedSeconds = (seconds % 60).toString().padStart(2, '0') + 's ';

  if (pattern == 'HMS') {
    return `${formatedHours}${formatedMins}${formatedSeconds}`;
  }
  if (pattern == 'HM') {
    return `${formatedHours}${formatedMins}`;
  }
  throw new Error(
    'Should declare a second argument for pattern "HMS" for hours:minutes:seconds or "HM" for hours:minutes',
  );
}

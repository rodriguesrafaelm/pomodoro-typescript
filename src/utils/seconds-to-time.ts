type timePattern = 'HMS' | 'HM';

export function secondsToTime(
  totalSeconds: number,
  pattern: timePattern,
): string {
  function addZeroLeft(value: number): string {
    return value.toString().padStart(2, '0');
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatedHours = hours ? addZeroLeft(hours) + 'h ' : '';
  const formatedMins = addZeroLeft(minutes) + 'm ';
  const formatedSeconds = addZeroLeft(seconds % 60) + 's ';

  if (pattern == 'HM') {
    return `${formatedHours}${formatedMins}`;
  }
  return `${formatedHours}${formatedMins}${formatedSeconds}`;
}

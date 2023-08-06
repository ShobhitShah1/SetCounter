export function formatTime(seconds: number): string {
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const remainingSeconds: number = seconds % 60;

  let timeString: string = "";

  if (hours > 0) {
    timeString += hours + "hr ";
  }
  if (minutes > 0) {
    timeString += minutes + "min ";
  }
  if (remainingSeconds > 0) {
    timeString += remainingSeconds + "sec";
  }

  return timeString.trim();
}

// const totalSeconds: number = 5064; // Replace with your actual total time in seconds
// const formattedTime: string = formatTime(totalSeconds);
// return formattedTime;

export default formatTime;

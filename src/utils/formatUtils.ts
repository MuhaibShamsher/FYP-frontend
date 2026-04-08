export const formatDateTime = (dateTimeString: string | null): string => {
  if (!dateTimeString) return "N/A";
  try {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error("Error formatting date-time:", error);
    return "Invalid Date";
  }
};

export const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return "N/A";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes} min ${remainingSeconds} secs`;
  } else {
    return `${remainingSeconds} secs`;
  }
};

export const getMonthRange = (monthIndex: number, year = new Date().getFullYear()) => {
    const firstDay = new Date(year, monthIndex, 1).toISOString().split("T")[0];
    const lastDay = new Date(year, monthIndex + 1, 0).toISOString().split("T")[0];
    return { firstDay, lastDay };
  };
  
  export const formatDate = (date: Date, format: string = "YYYY-MM-DD HH:mm:ss") => {
    const pad = (num: number) => num.toString().padStart(2, "0");
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    return format
      .replace("YYYY", year.toString())
      .replace("MM", month)
      .replace("DD", day)
      .replace("HH", hours)
      .replace("mm", minutes)
      .replace("ss", seconds);
  };
  
"use client"
export default function Day({ day, month }: { day: Date; month: number }) {
  const classes = "border rounded rounded-3 p-2 pb-4 m-1 ";

  const backgroundClass = day.getMonth() + 1 != month ? "" : "bg-slate-900";

  return (
    <div className={classes + " " + backgroundClass}>
      {day.getDate()}
      {/* <div>{day.getMonth()}</div> */}
    </div>
  );
}

"use client";

export default function Day({ day }: { day?: Date }) {
  const classes = "border rounded rounded-3 p-2 pb-4 m-1 ";
  if (!day) return <div className={classes + ""}></div>;

  return <div className={classes + " bg-slate-900"}>{day.getDate()}</div>;
}

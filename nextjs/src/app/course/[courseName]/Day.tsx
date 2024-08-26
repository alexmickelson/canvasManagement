"use client"
import React, { FC } from "react";

export const Day: FC<{ day?: Date }> = ({ day }) => {
  const classes = "border rounded rounded-3 p-2 pb-4 m-1 ";
  if (!day) return <div className={classes + ""}></div>;

  return <div className={classes + " bg-slate-900"}>{day.getDate()}</div>;
};

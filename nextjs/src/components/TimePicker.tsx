"use client";
import { SimpleTimeOnly } from "@/models/local/localCourseSettings";
import { FC, useState, useEffect } from "react";

export const TimePicker: FC<{
  setChosenTime: (simpleTime: SimpleTimeOnly) => void;
  time: SimpleTimeOnly;
}> = ({ setChosenTime, time }) => {
  const adjustedHour = time.hour % 12 === 0 ? 12 : time.hour % 12;
  const partOfDay = time.hour < 12 ? "AM" : "PM";

  // useEffect(() => {
  //   const newtime = {
  //     hour: partOfDay === "PM" ? hour + 12 : hour,
  //     minute: minute,
  //   };
  //   if (
  //     newtime.hour != startingTime.hour ||
  //     newtime.minute != startingTime.minute
  //   ) {
  //     setChosenTime(newtime);
  //   }
  // }, [
  //   hour,
  //   minute,
  //   partOfDay,
  //   setChosenTime,
  //   startingTime.hour,
  //   startingTime.minute,
  // ]);

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-row gap-3"
      >
        <div className="">
          <label>
            Hour
            <select
              value={adjustedHour}
              onChange={(e) => {
                const newHours = parseInt(e.target.value);
                setChosenTime({
                  ...time,
                  hour: partOfDay === "PM" ? newHours + 12 : newHours,
                });
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i).map((o) => (
                <option key={o.toString()}>{o}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="">
          <label>
            Minute
            <select
              value={time.minute}
              onChange={(e) => {
                const newMinute = parseInt(e.target.value);
                setChosenTime({
                  ...time,
                  minute: newMinute,
                });
              }}
            >
              {[0, 15, 30, 45, 59].map((o) => (
                <option key={o.toString()}>{o}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="">
          <label>
            Part of Day
            <select
              value={partOfDay}
              onChange={(e) => {
                const newPartOfDay = e.target.value;

                setChosenTime({
                  ...time,
                  hour: newPartOfDay === "PM" ? time.hour + 12 : time.hour,
                });
              }}
            >
              {["AM", "PM"].map((o) => (
                <option key={o.toString()}>{o}</option>
              ))}
            </select>
          </label>
        </div>
      </form>
    </>
  );
};

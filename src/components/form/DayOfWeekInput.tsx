import { DayOfWeek } from "@/features/local/course/localCourseSettings";

export function DayOfWeekInput({
  selectedDays,
  updateSettings,
}: {
  selectedDays: DayOfWeek[];
  updateSettings: (day: DayOfWeek) => void;
}) {
  return (
    <div className="flex flex-row gap-3">
      {Object.values(DayOfWeek).map((day) => {
        const hasDay = selectedDays.includes(day);
        return (
          <button
            role="button"
            key={day}
            className={hasDay ? "" : "unstyled btn-outline "}
            onClick={() => updateSettings(day)}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}

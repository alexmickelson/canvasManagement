import { DayOfWeek } from "@/features/local/course/localCourseSettings";

export function DayOfWeekInput({
  selectedDays,
  updateSettings,
}: {
  selectedDays: DayOfWeek[];
  updateSettings: (day: DayOfWeek) => void;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-2 sm:gap-3">
      {Object.values(DayOfWeek).map((day) => {
        const hasDay = selectedDays.includes(day);
        return (
          <button
            role="button"
            key={day}
            className={hasDay ? "" : "unstyled btn-outline "}
            onClick={() => updateSettings(day)}
          >
            <span className="sm:hidden">{day.slice(0, 3)}</span>
            <span className="hidden sm:inline">{day}</span>
          </button>
        );
      })}
    </div>
  );
}

import { DayOfWeek } from "@/models/local/localCourse";

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
            className={
              hasDay
                ? "bg-blue-300 text-blue-950 border-blue-500 border"
                : "bg-slate-900 border-blue-900 border "
            }
            onClick={() => updateSettings(day)}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}

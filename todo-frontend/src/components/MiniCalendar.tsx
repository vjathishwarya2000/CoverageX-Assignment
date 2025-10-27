import { memo, useMemo } from "react";

function monthMatrix(d = new Date()) {
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1);
  const start = new Date(y, m, 1 - ((first.getDay() + 6) % 7)); // Monday-first
  return Array.from({ length: 42 }, (_, i) =>
    new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
  );
}

type Props = { className?: string };
export default memo(function MiniCalendar({ className = "" }: Props) {
  const now = new Date();
  const days = useMemo(() => monthMatrix(now), []);
  const thisMonth = now.getMonth();
  const todayKey = now.toDateString();

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* tiny header */}
      <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs text-white">
        <span>{now.toLocaleString(undefined, { month: "long", year: "numeric" })}</span>
        {/* <span className="rounded-md bg-white/15 px-2 py-0.5">Mini</span> */}
      </div>

      {/* weekdays */}
      <div className="grid grid-cols-7 gap-1 px-2 pt-2 text-center text-[10px] font-medium text-gray-500">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d}>{d}</div>)}
      </div>

      {/* small days grid (short) */}
      <div className="grid grid-cols-7 gap-1 px-2 pb-3">
        {days.map((d) => {
          const inMonth = d.getMonth() === thisMonth;
          const isToday = d.toDateString() === todayKey;
          return (
            <div
              key={d.toISOString()}
              className={[
                "h-7 w-full rounded-lg border text-[11px] leading-7 text-center",
                isToday
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : inMonth
                    ? "border-gray-200 bg-white text-gray-800"
                    : "border-gray-100 bg-gray-50 text-gray-400",
              ].join(" ")}
            >
              {d.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
});

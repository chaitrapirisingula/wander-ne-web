import { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { sites_db, analytics } from "../Data/Firebase";
import { logEvent } from "firebase/analytics";
import WanderDefaultImage from "../Images/WanderDefaultImage.png";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Parse date strings like "5/12/2026" as local calendar date (U.S. M/D/Y). */
function parseEventDateString(str) {
  if (!str || typeof str !== "string") return null;
  const trimmed = str.trim();
  const parts = trimmed.split(/[-/]/).map((p) => p.trim());
  if (parts.length !== 3) return null;
  const a = parseInt(parts[0], 10);
  const b = parseInt(parts[1], 10);
  const y = parseInt(parts[2], 10);
  if (!y || Number.isNaN(y)) return null;
  if (a <= 12 && b <= 31) {
    const d = new Date(y, a - 1, b);
    if (
      d.getFullYear() === y &&
      d.getMonth() === a - 1 &&
      d.getDate() === b
    ) {
      return d;
    }
  }
  return null;
}

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Shorten "10:00:00 AM" → "10:00 AM" when possible. */
function formatTimeDisplay(time) {
  if (!time || typeof time !== "string") return null;
  const t = time.trim();
  const m = t.match(/^(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i);
  if (m) return `${m[1]}:${m[2]} ${m[4].toUpperCase()}`;
  return t;
}

function eventDayKey(ev) {
  const d = parseEventDateString(ev.date);
  if (d) return dateKey(d);
  return `__${ev.date || "unknown"}__${ev.id || ""}`;
}

function buildMonthCells(viewYear, viewMonth) {
  const first = new Date(viewYear, viewMonth, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) {
    cells.push({ type: "pad", key: `pad-start-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(viewYear, viewMonth, day);
    cells.push({ type: "day", date: d, key: dateKey(d) });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ type: "pad", key: `pad-end-${cells.length}` });
  }
  return cells;
}

function SiteThumb({ siteRecord, label }) {
  const [imgError, setImgError] = useState(false);
  const src =
    !imgError && siteRecord?.image ? siteRecord.image : WanderDefaultImage;
  return (
    <img
      src={src}
      alt={label || "Site"}
      className="w-full h-full object-cover"
      onError={() => setImgError(true)}
    />
  );
}

function EventBlock({
  ev,
  siteRecord,
  href,
  onSiteClick,
  variant,
}) {
  const timeStr = formatTimeDisplay(ev.time);
  const imgShell =
    variant === "timeline"
      ? "w-full shrink-0 aspect-[4/3] rounded-lg border border-gray-200 bg-gray-100 sm:aspect-auto sm:h-44 sm:w-56 md:h-48 md:w-64 lg:h-52 lg:w-72 overflow-hidden"
      : "w-full shrink-0 aspect-[4/3] rounded-lg border border-gray-200 bg-gray-100 sm:aspect-auto sm:h-36 sm:w-48 md:h-40 md:w-56 overflow-hidden";

  return (
    <article
      className={
        variant === "timeline"
          ? "flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-xl border border-gray-100 bg-gray-50/80 shadow-sm"
          : "flex flex-col sm:flex-row gap-3 sm:gap-4"
      }
    >
      <div className={imgShell}>
        <SiteThumb siteRecord={siteRecord} label={ev.site} />
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className={
            variant === "timeline"
              ? "text-xl font-bold text-blue-800"
              : "text-lg font-semibold text-gray-900"
          }
        >
          {ev.name}
        </h4>
        {ev.site && (
          <p className="text-blue-600 mt-1">
            {href ? (
              <button
                type="button"
                className="text-left hover:underline font-medium"
                onClick={onSiteClick}
              >
                {ev.site}
              </button>
            ) : (
              <span>{ev.site}</span>
            )}
          </p>
        )}
        {timeStr && (
          <p className="text-gray-600 text-sm mt-1">{timeStr}</p>
        )}
        {ev.description && (
          <p className="text-gray-700 mt-3 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {ev.description}
          </p>
        )}
      </div>
    </article>
  );
}

export default function EventsPage({ sites }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [viewMode, setViewMode] = useState("calendar");
  const [calView, setCalView] = useState(() => {
    const n = new Date();
    return { year: n.getFullYear(), month: n.getMonth() };
  });
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const eventsRef = ref(sites_db, "2026_events");
        const snapshot = await get(eventsRef);
        if (snapshot.exists()) {
          const list = [];
          snapshot.forEach((child) => {
            const val = child.val();
            if (val && typeof val === "object") {
              list.push({
                ...val,
                id: child.key,
              });
            }
          });
          list.sort((a, b) => {
            const da = parseEventDateString(a.date);
            const db = parseEventDateString(b.date);
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            return da - db;
          });
          setEvents(list);
        }
        setFetchError(false);
      } catch (err) {
        console.error(err);
        setFetchError(true);
        logEvent(analytics, "error_fetching_events");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const siteByName = useMemo(() => {
    const map = new Map();
    (sites || []).forEach((s) => {
      if (s && s.name) map.set(s.name, s);
    });
    return map;
  }, [sites]);

  const siteHref = useCallback(
    (siteName) => {
      if (!siteName) return null;
      if (siteByName.has(siteName)) {
        return `/explore/${encodeURIComponent(siteName)}`;
      }
      return null;
    },
    [siteByName]
  );

  const goToSite = useCallback(
    (siteName) => {
      const href = siteHref(siteName);
      if (!href) return;
      navigate(href, { state: siteByName.get(siteName) });
      window.scrollTo(0, 0);
    },
    [navigate, siteByName, siteHref]
  );

  const eventsByDay = useMemo(() => {
    const map = new Map();
    events.forEach((ev) => {
      const d = parseEventDateString(ev.date);
      if (!d) return;
      const k = dateKey(d);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(ev);
    });
    return map;
  }, [events]);

  /** Timeline only: today or future (local date, start of day). */
  const timelineEvents = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return events.filter((ev) => {
      const d = parseEventDateString(ev.date);
      if (!d) return false;
      return d >= startOfToday;
    });
  }, [events]);

  const calendarCells = useMemo(
    () => buildMonthCells(calView.year, calView.month),
    [calView.year, calView.month]
  );

  const today = new Date();
  const todayKey = dateKey(today);

  function goPrevMonth() {
    setCalView((v) => {
      let m = v.month - 1;
      let y = v.year;
      if (m < 0) {
        m = 11;
        y -= 1;
      }
      return { year: y, month: m };
    });
    setSelectedKey(null);
  }

  function goNextMonth() {
    setCalView((v) => {
      let m = v.month + 1;
      let y = v.year;
      if (m > 11) {
        m = 0;
        y += 1;
      }
      return { year: y, month: m };
    });
    setSelectedKey(null);
  }

  const selectedEvents = selectedKey
    ? eventsByDay.get(selectedKey) || []
    : [];

  function setMode(next) {
    setViewMode(next);
    if (next === "timeline") setSelectedKey(null);
  }

  return (
    <div className="min-h-screen bg-yellow-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Events | WanderNebraska</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-blue-700">
          2026 Events
        </h1>

        {!loading && !fetchError && events.length > 0 && (
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex rounded-lg border-2 border-blue-600 bg-white p-1 shadow-sm"
              role="group"
              aria-label="View mode"
            >
              <button
                type="button"
                onClick={() => setMode("calendar")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition sm:px-6 sm:text-base ${
                  viewMode === "calendar"
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                Calendar
              </button>
              <button
                type="button"
                onClick={() => setMode("timeline")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition sm:px-6 sm:text-base ${
                  viewMode === "timeline"
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                Timeline
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-600">Loading events…</p>
        ) : fetchError ? (
          <p className="text-center text-red-600">
            Could not load events. Please try again later.
          </p>
        ) : (
          <>
            {viewMode === "timeline" && events.length > 0 && timelineEvents.length > 0 && (
              <div className="relative mx-auto mb-8 w-full max-w-2xl">
                {/* Line center at 16px; w-0.5 (2px) → spans 15–17px */}
                <div
                  className="absolute bottom-3 left-[15px] top-3 w-0.5 bg-blue-200"
                  aria-hidden
                />
                <ul className="space-y-0">
                  {timelineEvents.map((ev, idx) => {
                    const d = parseEventDateString(ev.date);
                    const siteRecord = ev.site
                      ? siteByName.get(ev.site)
                      : null;
                    const href = siteHref(ev.site);
                    const prev = idx > 0 ? timelineEvents[idx - 1] : null;
                    const showDateHeader =
                      idx === 0 ||
                      eventDayKey(ev) !== eventDayKey(prev);

                    return (
                      <li key={ev.id} className="relative pb-10 pl-10 last:pb-0 sm:pl-12">
                        {/* Dot centered on line: 12px dot → left 10px; 16px dot → left 8px (line center 16px) */}
                        <span
                          className="absolute left-[10px] top-2 z-10 h-3 w-3 rounded-full border-2 border-yellow-100 bg-blue-600 shadow sm:left-2 sm:h-4 sm:w-4"
                          aria-hidden
                        />
                        {showDateHeader &&
                          (d ? (
                            <p className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-3">
                              {formatDisplayDate(d)}
                            </p>
                          ) : (
                            <p className="text-sm font-bold text-amber-800 mb-3">
                              Date: {ev.date || "TBA"}
                            </p>
                          ))}
                        <EventBlock
                          ev={ev}
                          siteRecord={siteRecord}
                          href={href}
                          onSiteClick={() => goToSite(ev.site)}
                          variant="timeline"
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {viewMode === "timeline" && events.length > 0 && timelineEvents.length === 0 && (
              <p className="mx-auto mb-8 max-w-2xl text-center text-gray-600">
                No upcoming events on the timeline. Past events stay on the calendar.
              </p>
            )}

            {viewMode === "calendar" && (
              <div className="mx-auto mb-8 max-w-4xl">
                <div className="relative">
                  <div className="overflow-hidden rounded-xl border border-yellow-200 bg-white shadow-md">
                    <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
                      <button
                        type="button"
                        onClick={goPrevMonth}
                        className="rounded-lg px-3 py-1 font-semibold transition hover:bg-blue-500"
                        aria-label="Previous month"
                      >
                        ←
                      </button>
                      <h2 className="text-xl font-bold">
                        {MONTH_NAMES[calView.month]} {calView.year}
                      </h2>
                      <button
                        type="button"
                        onClick={goNextMonth}
                        className="rounded-lg px-3 py-1 font-semibold transition hover:bg-blue-500"
                        aria-label="Next month"
                      >
                        →
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                      {WEEKDAYS.map((w) => (
                        <div
                          key={w}
                          className="bg-blue-50 py-2 text-center text-xs font-semibold text-blue-800 sm:text-sm"
                        >
                          {w}
                        </div>
                      ))}
                      {calendarCells.map((cell) => {
                        if (cell.type === "pad") {
                          return (
                            <div
                              key={cell.key}
                              className="min-h-[72px] bg-gray-50 sm:min-h-[88px]"
                            />
                          );
                        }
                        const k = dateKey(cell.date);
                        const dayEvents = eventsByDay.get(k) || [];
                        const isToday = k === todayKey;
                        const isSelected = selectedKey === k;
                        return (
                          <button
                            key={cell.key}
                            type="button"
                            onClick={() => {
                              if (!dayEvents.length) return;
                              setSelectedKey(isSelected ? null : k);
                            }}
                            className={`min-h-[72px] p-1 text-left align-top transition sm:min-h-[88px] sm:p-2 ${
                              dayEvents.length
                                ? "cursor-pointer bg-amber-50 hover:bg-amber-100"
                                : "bg-white hover:bg-gray-50"
                            } ${isToday ? "ring-2 ring-inset ring-blue-400" : ""} ${
                              isSelected
                                ? "ring-2 ring-inset ring-yellow-500"
                                : ""
                            }`}
                            disabled={!dayEvents.length}
                            aria-pressed={isSelected}
                            aria-label={
                              dayEvents.length
                                ? `${cell.date.getDate()}, ${dayEvents.length} event(s)`
                                : undefined
                            }
                          >
                            <span
                              className={`text-sm font-semibold sm:text-base ${
                                isToday ? "text-blue-700" : "text-gray-800"
                              }`}
                            >
                              {cell.date.getDate()}
                            </span>
                            {dayEvents.length > 0 && (
                              <span className="mt-0.5 block truncate text-[10px] font-medium text-amber-900 sm:text-xs">
                                {dayEvents.length === 1
                                  ? dayEvents[0].name
                                  : `${dayEvents.length} events`}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {selectedKey && selectedEvents.length > 0 && (
                    <div
                      className="absolute inset-0 z-20 flex flex-col overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xl"
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby="events-day-title"
                    >
                      <div className="flex shrink-0 flex-col gap-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() => setSelectedKey(null)}
                          className="inline-flex w-fit items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/25"
                        >
                          <span aria-hidden>←</span> Back to calendar
                        </button>
                        <h3
                          id="events-day-title"
                          className="text-lg font-bold sm:text-xl"
                        >
                          {formatDisplayDate(
                            parseEventDateString(selectedEvents[0].date)
                          )}
                        </h3>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                        <ul className="space-y-6">
                          {selectedEvents.map((ev) => {
                            const siteRecord = ev.site
                              ? siteByName.get(ev.site)
                              : null;
                            const href = siteHref(ev.site);
                            return (
                              <li
                                key={ev.id}
                                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                              >
                                <EventBlock
                                  ev={ev}
                                  siteRecord={siteRecord}
                                  href={href}
                                  onSiteClick={() => goToSite(ev.site)}
                                  variant="calendar"
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {events.length === 0 && !fetchError && (
              <p className="text-center text-gray-600">
                No events are listed yet. Check back soon.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

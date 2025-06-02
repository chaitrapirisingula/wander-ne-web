import { useState, useEffect } from "react";
import { sites_db } from "../Data/Firebase";
import { ref, onValue } from "firebase/database";
import WanderNebraskaLogo from "../Images/WanderDefaultImage.png";

const months = [
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

const pastelColors = [
  "bg-pink-200 text-pink-900",
  "bg-green-200 text-green-900",
  "bg-yellow-200 text-yellow-900",
  "bg-purple-200 text-purple-900",
  "bg-orange-200 text-orange-900",
  "bg-teal-200 text-teal-900",
];

const getEventsByDate = (groupedEvents, selectedDate) => {
  return Object.entries(groupedEvents).flatMap(([site, events]) =>
    events.filter((e) => e.date === selectedDate).map((e) => ({ ...e, site }))
  );
};

const getUpcomingEvents = (groupedEvents) => {
  const all = Object.entries(groupedEvents).flatMap(([site, evs]) =>
    evs.map((e) => ({ ...e, site }))
  );
  return all
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const SiteImage = ({ img, title, sty }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <img
      src={!imgError && img ? img : WanderNebraskaLogo}
      alt={title}
      className={sty}
      onError={() => setImgError(true)}
    />
  );
};

export default function Calendar({ sites = [] }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [showing, setShowing] = useState("calendar");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  useEffect(() => {
    const eventsRef = ref(sites_db, "2025_events");
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const eventsArray = Object.values(data).map((e) => {
          const parsedDate = new Date(e.date);
          const isoDate = parsedDate.toISOString().split("T")[0];
          return {
            ...e,
            date: isoDate,
            title: e.name,
          };
        });

        const grouped = {};
        for (const event of eventsArray) {
          if (!grouped[event.site]) grouped[event.site] = [];
          grouped[event.site].push(event);
        }
        setGroupedEvents(grouped);
      }
    });
  }, []);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const handleMonthChange = (offset) => {
    const newDate = new Date(year, month + offset);
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
  };

  const getSiteImage = (siteName) => {
    const site = sites.find((s) => s.name === siteName);
    return site?.image || null;
  };

  const upcomingEvents = getUpcomingEvents(groupedEvents);
  const closeModal = () => setSelectedEvent(null);
  const toggleDay = (dateStr) =>
    setExpandedDays((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));

  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <div className="mb-4 flex gap-4 justify-center">
        <button
          onClick={() => setShowing("calendar")}
          className={`px-4 py-2 rounded-full ${
            showing === "calendar"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500"
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setShowing("events")}
          className={`px-4 py-2 rounded-full ${
            showing === "events"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 border border-blue-500"
          }`}
        >
          Upcoming Events
        </button>
      </div>

      <div className="mx-auto max-w-6xl w-full flex justify-center">
        {showing === "calendar" && (
          <div
            className="w-full bg-white border shadow-md rounded-2xl p-6 overflow-auto"
            style={{ maxHeight: "720px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => handleMonthChange(-1)}>&larr;</button>
              <h2 className="text-2xl font-bold text-blue-800">
                {months[month]} {year}
              </h2>
              <button onClick={() => handleMonthChange(1)}>&rarr;</button>
            </div>

            <div className="grid grid-cols-7 text-center font-semibold mb-2 text-blue-700">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 overflow-visible">
              {Array(firstDay)
                .fill(null)
                .map((_, i) => (
                  <div key={`blank-${i}`} />
                ))}
              {[...Array(daysInMonth)].map((_, i) => {
                const dateStr = `${year}-${String(month + 1).padStart(
                  2,
                  "0"
                )}-${String(i + 1).padStart(2, "0")}`;
                const events = getEventsByDate(groupedEvents, dateStr);
                const isExpanded = expandedDays[dateStr];

                return (
                  <div
                    key={i}
                    className="border p-2 rounded bg-white hover:bg-gray-100 min-h-[80px] text-left text-xs"
                  >
                    <div className="font-bold text-blue-900 mb-1">{i + 1}</div>
                    {(isExpanded ? events : events.slice(0, 2)).map(
                      (e, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedEvent(e)}
                          className={`cursor-pointer truncate rounded px-1 py-[2px] mb-1 ${
                            pastelColors[idx % pastelColors.length]
                          } hover:brightness-95 transition`}
                        >
                          {e.title}
                        </div>
                      )
                    )}
                    {events.length > 2 && (
                      <button
                        onClick={() => toggleDay(dateStr)}
                        className="text-[10px] text-blue-600 hover:underline"
                      >
                        {isExpanded
                          ? "show less"
                          : `+ ${events.length - 2} more`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showing === "events" && (
          <div
            className="w-full max-w-6xl bg-white border shadow-md rounded-2xl p-6"
            style={{ maxHeight: "700px", overflowY: "auto" }}
          >
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              🎉 Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <p>No upcoming events</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.map((event, i) => {
                  const image = getSiteImage(event.site);
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedEvent(event)}
                      className="cursor-pointer flex gap-3 bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition"
                    >
                      {image && (
                        <SiteImage
                          img={image}
                          title={event.site}
                          sty={"w-24 h-20 object-cover rounded-md"}
                        />
                      )}
                      <div className="flex flex-col justify-between text-left text-sm">
                        <div className="font-semibold text-blue-800">
                          {event.title}
                        </div>
                        <div className="text-gray-600">{event.site}</div>
                        <div className="text-gray-500 text-xs">
                          🗓️ {new Date(event.date).toLocaleDateString()}
                          {event.time && ` at ${event.time}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>
            {getSiteImage(selectedEvent.site) && (
              <SiteImage
                img={getSiteImage(selectedEvent.site)}
                title={selectedEvent.site}
                sty={"w-full h-40 object-cover rounded-lg mb-4"}
              />
            )}
            <h3 className="text-xl font-bold text-blue-700">
              {selectedEvent.title}
            </h3>
            <p className="text-sm text-gray-600 italic">{selectedEvent.site}</p>
            <p className="text-sm mt-3">{selectedEvent.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              🗓️ {new Date(selectedEvent.date).toLocaleDateString()}
            </p>
            {selectedEvent.time && (
              <p className="text-sm text-gray-500">⏰ {selectedEvent.time}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, getDay } from "date-fns";
import { FaBackward, FaForward } from "react-icons/fa6";
import axios from "axios";
import { X, Bold, Italic, AlignLeft, Smile, MapPin, Clock } from "lucide-react";
import { useAuth } from "../../context/Auth";

function UserCalender() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [durationType, setDurationType] = useState("without");
  const [dateTime, setDateTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState({});
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [auth, setAuth] = useAuth();

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await axios.get(`/Calendar/events/`);
  //       const fetchedEvents = response.data;
  //       const formattedEvents = fetchedEvents.reduce((acc, event) => {
  //         const eventDate = format(new Date(event.date), "yyyy-MM-dd");
  //         if (!acc[eventDate]) acc[eventDate] = [];
  //         acc[eventDate].push(event);
  //         return acc;
  //       }, {});
  //       setEvents(formattedEvents);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };
  //   fetchEvents();
  // }, [auth.user.id]);
  const insertText = (text) => {
    console.log("Inserting text:", text);
    // Add logic here to insert text into a textarea or editor
  };

  const next = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    if (view === "year") setCurrentDate(addMonths(currentDate, 12));
  };

  const prev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    if (view === "year") setCurrentDate(subMonths(currentDate, 12));
  };

  const CreateEvent = async () => {
    if (!title || !dateTime || !description || !location) {
      alert("All fields are required.");
      return;
    }

    try {
      const eventData = {
        title,
        date: new Date(dateTime).toISOString(),
        event_type: "meeting",
        description,
        location,
        duration: new Date(
          new Date(dateTime).getTime() + 60 * 60 * 1000
        ).toISOString(),
        repeat_weekly: 1,
        admin_id:auth.user.id,
      };

      const response = await axios.post("/Calendar/events/create/", eventData, {
        headers: { "Content-Type": "application/json" },
      });

      const formattedDate = format(new Date(dateTime), "yyyy-MM-dd");
      const newEvent = {
        id: response.data.id || Math.floor(Math.random() * 1000),
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        time: format(new Date(dateTime), "HH:mm"),
        event_type: eventData.event_type,
      };

      setEvents((prevEvents) => ({
        ...prevEvents,
        [formattedDate]: [...(prevEvents[formattedDate] || []), newEvent],
      }));

      alert("Event created successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error(
        "Error creating event",
        error.response?.data || error.message
      );
      alert("Failed to create event");
    }
  };

  const handleDateClick = (day) => {
    const selectedDate = format(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
      "yyyy-MM-dd"
    );
    setDate(selectedDate);
    // setIsModalOpen(true);
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = getDay(firstDayOfMonth); // 0 (Sun) to 6 (Sat)

    const calendarCells = [];

    // Add empty cells before 1st day
    for (let i = 0; i < startDay; i++) {
      calendarCells.push(
        <div
          key={`empty-${i}`}
          className="min-h-[110px] sm:min-h-[120px] border bg-gray-100 border-gray-300"
        />
      );
    }

    // Render actual dates
    for (let day = 1; day <= daysInMonth; day++) {
      const eventDate = format(new Date(year, month, day), "yyyy-MM-dd");

      calendarCells.push(
        <div
          key={day}
          className={`relative min-h-[110px] sm:min-h-[120px] border rounded-sm transition-all duration-200 text-xs sm:text-sm text-left p-2 sm:p-3
            ${
              events[eventDate]
                ? "bg-blue-100 border-blue-400 shadow-sm hover:shadow-md"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
          onClick={() => handleDateClick(day)}
        >
          <div className="font-semibold text-sm sm:text-base mb-1 text-gray-700">
            {day}
          </div>

          <div className="flex flex-col gap-1 pr-1">
            {events[eventDate] &&
              events[eventDate].filter((event)=> event.admin_id===auth.user.admin_id).map((event, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-300 rounded-md px-1 py-1 text-[11px] sm:text-xs shadow-sm hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-blue-600">
                    {event.title}
                  </div>
                  <div className="text-gray-600">{event.description}</div>
                  <div className="flex items-center justify-between text-gray-500 mt-1">
                    <span className="text-[10px] whitespace-nowrap">
                      {event.date?.split(" ")[1] || "--:--"}
                    </span>
                    <span className="bg-gray-200 text-gray-700 text-[10px] px-1 rounded">
                      {event.event_type}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-7 gap-2 text-center text-xs sm:text-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="font-bold bg-cyan-500 border border-gray-800 p-1 sm:p-2"
            >
              {day}
            </div>
          ))}
          {calendarCells}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      <div className="w-full overflow-x-auto p-4 sm:p-6 bg-white border border-gray-900 shadow-lg">
        <div className="text-xl sm:text-3xl font-bold mt-5 mb-5">Calendar</div>

        <div className="flex justify-between items-center font-bold mt-5">
          <div className="flex space-x-2">
            {["date", "month", "year"].map((type) => (
              <button
                key={type}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all border border-gray-800 ${
                  view === type ? "bg-white-700" : "bg-white-500"
                } text-black`}
                onClick={() => setView(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 mt-5">
          <button
            className="px-3 sm:px-4 py-2 bg-gray-300 rounded"
            onClick={prev}
          >
            <FaBackward />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold">
            {format(currentDate, view === "year" ? "yyyy" : "MMMM yyyy")}
          </h2>
          <button
            className="px-3 sm:px-4 py-2 bg-gray-300 rounded"
            onClick={next}
          >
            <FaForward />
          </button>
        </div>

        {view === "month" && renderMonthView()}

        {view === "year" && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const monthDate = new Date(currentDate.getFullYear(), i, 1);
              return (
                <button
                  key={i}
                  className="p-3 bg-gray-200 rounded-lg text-center text-sm sm:text-base font-semibold hover:bg-gray-300"
                  onClick={() => {
                    setCurrentDate(monthDate);
                    setView("month");
                  }}
                >
                  {format(monthDate, "MMMM")}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="  fixed inset-0 bg-black bg-opacity-60 flex items-center  overflow-y-auto justify-center p-4">
          <div className=" w-500 m-auto absolute left-20 p-6 bg-blue-100 shadow-xl max-w-lg mx-auto rounded-lg font-serif relative shadow-blue-500 mt-15">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold"> Add New Event</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <div className="flex space-x-2 mb-2">
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() => insertText("", "")}
                >
                  <Bold size={18} />
                </button>
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() => insertText("*", "*")}
                >
                  <Italic size={18} />
                </button>
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() => insertText("\n")}
                >
                  <AlignLeft size={18} />
                </button>
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() => insertText("😊 ")}
                >
                  <Smile size={18} />
                </button>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded focus:ring focus:ring-blue-300 h-24"
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border p-2 rounded focus:ring focus:ring-blue-300 pl-10"
                />
                <MapPin
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <label className="flex items-center text-gray-700">
                <Clock className="mr-2 text-gray-600" size={18} /> Duration
              </label>
              <button
                className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300
          ${
            durationType !== "without"
              ? "bg-gradient-to-r from-blue-400 to-blue-600 shadow-md"
              : "bg-gray-300"
          }`}
                onClick={() =>
                  setDurationType(
                    durationType === "without" ? "until" : "without"
                  )
                }
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300
            ${durationType !== "without" ? "translate-x-6" : "translate-x-0"}`}
                ></div>
              </button>
            </div>

            {durationType !== "without" && (
              <div className="mb-4">
                {durationType === "until" && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              onClick={CreateEvent}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserCalender;
import React, { useEffect, useState } from "react";
import { GrView } from "react-icons/gr";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    event_type: "",
    description: "",
    location: "",
    duration: "",
    repeat_weekly: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://hola9.in/Calendar/events/");
      console.log("Fetched Events:", response.data);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleModal = (event = null) => {
    setSelectedEvent(event);
    setNewEvent(
      event
        ? { ...event }
        : {
            title: "",
            date: "",
            event_type: "",
            description: "",
            location: "",
            duration: "",
            repeat_weekly: "",
          }
    );
    setModalOpen(true);
  };

  const saveEvent = async () => {
    try {
      if (!newEvent.event_type) {
        alert("Please select a valid event type.");
        return;
      }

      const updatedEvent = {
        title: newEvent.title,
        date: newEvent.date ? new Date(newEvent.date).toISOString() : null,
        duration: newEvent.duration
          ? new Date(newEvent.duration).toISOString()
          : null,
        event_type: newEvent.event_type,
        description: newEvent.description,
        location: newEvent.location,
        repeat_weekly: newEvent.repeat_weekly
          ? parseInt(newEvent.repeat_weekly, 10) || 1
          : 0,
      };

      console.log("Updated Event Payload:", updatedEvent);

      if (selectedEvent) {
        const response = await axios.put(
          `/Calendar/events/update/${selectedEvent.id}/`,
          updatedEvent
        );
        toast.success("Event Updated Successfully");
        console.log("Updated Event Response:", response.data);

        // Update state immediately
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id ? response.data : event
          )
        );
      } else {
        const response = await axios.post(
          "/api/v1/event/create",
          updatedEvent
        );

        console.log("New Event Response:", response.data);

        // Append new event to state
        setEvents((prevEvents) => [...prevEvents, response.data]);
      }

      setModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save the event. Please check the input fields.");
    }
  };

  const deleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`/Calendar/events/delete/${id}/`);
        setEvents(events.filter((event) => event.id !== id));
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete the event. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-500">
        All Events
      </h1>
      <div className="bg-white shadow-2xl rounded-lg p-6 border border-gray-300 overflow-x-auto font-serif">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-gray-600 text-white text-lg">
              <th className="p-4 border text-left">ID</th>
              <th className="p-4 border text-left">Title</th>
              <th className="p-4 border text-left">Date</th>
              <th className="p-4 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr
                key={event.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <td className="p-4 border">{event.id}</td>
                <td className="p-4 border">{event.title}</td>
                <td className="p-4 border">{event.date}</td>
                <td className="p-4 border flex gap-2 justify-center">
                
                  <button
                    onClick={() => handleModal(event)}
                    className="bg-yellow-500 px-4 py-2 rounded text-white"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="bg-red-500 px-4 py-2 rounded text-white"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-opacity-80 font-serif animate-fadeIn font-serif">
          <div className="bg-white p-6 w-96 rounded-2xl shadow-lg shadow-blue-500 transition-transform transform hover:scale-105 duration-300 ml-65">
            <h2 className="text-xl font-bold mb-4">
  
              {selectedEvent ? "Edit Event" : "Add New Event"}
            </h2>
            <div className="flex justify-center mb-4">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSIxWmNxgv2cE7We895wZa6L0LGCPipn4aig&s"
                  alt="Logo"
                  className="w-16 h-16"
                />
              </div>
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
              placeholder="Event Title"
            />
            <textarea
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
              placeholder="Description"
            ></textarea>
            <input
              type="text"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
              placeholder="Location"
            />
            <input
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              className="w-full border p-2 rounded mb-4"
            />
            <button
              onClick={saveEvent}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg transition-all hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-500 text-white px-5 py-2 rounded-lg transition-all hover:bg-gray-600 ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ManageEvent;

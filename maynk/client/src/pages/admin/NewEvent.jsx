


import { useState } from "react";
import { Calendar, Clock, MapPin, Repeat, X, Bold, Italic, AlignLeft, Smile } from "lucide-react";

const NewEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [durationType, setDurationType] = useState("without");
  const [duration, setDuration] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [repeat, setRepeat] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);

  const insertText = (prefix, suffix = "") => {
    const textarea = document.getElementById("description");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = description;
    const newText = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
    setDescription(newText);
    
    setTimeout(() => {
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="p-6 bg-blue-100 shadow-xl max-w-lg mx-auto rounded-lg font-serif relative shadow-blue-500 mt-15 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold"> Add New Event</h2>
        <button className="text-gray-600 hover:text-red-500">
          <X size={20} />
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded focus:ring focus:ring-blue-300"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <div className="flex space-x-2 mb-2">
          <button className="text-gray-600 hover:text-black" onClick={() => insertText("", "")}><Bold size={18} /></button>
          <button className="text-gray-600 hover:text-black" onClick={() => insertText("*", "*")}><Italic size={18} /></button>
          <button className="text-gray-600 hover:text-black" onClick={() => insertText("\n") }><AlignLeft size={18} /></button>
          <button className="text-gray-600 hover:text-black" onClick={() => insertText("😊 ")}><Smile size={18} /></button>
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
          <MapPin className="absolute top-3 left-3 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center text-gray-700">
          <Clock className="mr-2 text-gray-600" size={18} /> Duration
        </label>
        <button
          className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 
          ${durationType !== "without" ? 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-md' : 'bg-gray-300'}`}
          onClick={() => setDurationType(durationType === "without" ? "until" : "without")}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 
            ${durationType !== "without" ? 'translate-x-6' : 'translate-x-0'}`}
          ></div>
        </button>
      </div>

      {durationType !== "without" && (
        <div className="mb-4">
          {durationType === "until" && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Date & Time</label>
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
      
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center text-gray-700">
          <Repeat className="mr-2 text-gray-600" size={18} /> Repeat this event!
        </label>
        <button
          className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 
          ${repeat ? 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-md' : 'bg-gray-300'}`}
          onClick={() => setRepeat(!repeat)}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 
            ${repeat ? 'translate-x-6' : 'translate-x-0'}`}
          ></div>
        </button>
      </div>
      
      {repeat && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Repeat weekly, creating altogether</label>
          <div className="relative">
            <input
              type="number"
              value={repeatCount}
              onChange={(e) => setRepeatCount(e.target.value)}
              className="w-full border p-2 rounded focus:ring focus:ring-blue-300 pl-10"
            />
            <Calendar className="absolute top-3 left-3 text-gray-400" size={18} />
          </div>
        </div>
      )}
      
      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">Save</button>
    </div>
  );
};

export default NewEvent;

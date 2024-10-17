import React, { useState } from "react";

interface TimeRangePickerProps {
  onChange: (range: string) => void;
}

const TimeRangePicker: React.FC<TimeRangePickerProps> = ({ onChange }) => {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const timeOptions = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      timeOptions.push(
        `${i.toString().padStart(2, "0")}:${j.toString().padStart(2, "0")}`
      );
    }
  }

  const handleTimeChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
    onChange(`${startTime} - ${endTime}`);
  };

  return (
    <div className="flex space-x-2">
      <select
        value={startTime}
        onChange={(e) => handleTimeChange("start", e.target.value)}
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {timeOptions.map((time) => (
          <option key={`start-${time}`} value={time}>
            {time}
          </option>
        ))}
      </select>
      <span className="self-center">-</span>
      <select
        value={endTime}
        onChange={(e) => handleTimeChange("end", e.target.value)}
        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {timeOptions.map((time) => (
          <option key={`end-${time}`} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeRangePicker;

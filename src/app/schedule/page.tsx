"use client";
import React, { useEffect, useState } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  EventInput,
  // EventSourceInput,
  EventContentArg,
  EventApi,
  Calendar,
} from "@fullcalendar/core";
import Modal from "../component/common/Modal";
import TimeRangePicker from "./TimeRangePicker";
import { useEventStore } from "../store/useEventStore";
import { usePartnerStore } from "../store/usePartnerStore";
import { Event } from "../store/useEventStore";

// interface CustomEvent {
//   id: string;
//   title: string;
//   start: string;
//   end: string;
//   extendedProps: {
//     partnerName: string;
//     partnerColor: string;
//   };
// }

const Schedule: React.FC = () => {
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTimeRange, setEventTimeRange] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { partners, fetchPartners } = usePartnerStore();
  const { events, fetchEvents, addEvent, updateEvent, deleteEvent } =
    useEventStore();
  // const [events, setEvents] = useState<CustomEvent[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  useEffect(() => {
    fetchEvents();
    fetchPartners();
  }, [fetchEvents, fetchPartners]);

  useEffect(() => {
    const calendarEl = document.getElementById("calendar");
    if (calendarEl) {
      const newCalendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        select: (info) => {
          setSelectedDate(info.startStr);
          setIsAddEventModalOpen(true);
        },
        events: events as EventInput[],
        eventClick: (info: { event: EventApi }) => {
          const customEvent: Event = {
            id: info.event.id,
            title: info.event.title,
            start: info.event.startStr,
            end: info.event.endStr,
            partnerName: info.event.extendedProps.partnerName,
            partnerColor: info.event.extendedProps.partnerColor,
          };
          setSelectedEvent(customEvent);
          setIsEventDetailModalOpen(true);
        },
        // eventClick: (info) => {
        //   setSelectedEvent(info.event);
        //   setIsModalOpen(true);
        //   // const clickedEvent = events.find((e) => e.id === info.event.id);
        //   // if (clickedEvent) {
        //   //   setSelectedEvent(clickedEvent);
        //   //   setIsEventDetailModalOpen(true);
        //   // }
        // },
        eventContent: (arg: EventContentArg) => {
          const eventColor = arg.event.extendedProps.partnerColor;
          // const hover = "hover" ? "cursor : pointer;" : "cursor : default;";
          const style =
            eventColor && eventColor !== "#ffffff"
              ? `background-color: ${eventColor}; color: white;`
              : `background-color: white; color: black; border: 1px solid black;`;
          return {
            html: `<div class="fc-content" style="${style} cursor: pointer; padding: 2px 4px; border-radius: 4px;">${arg.event.title}</div>`,
          };
        },
      });

      newCalendar.render();
      setCalendar(newCalendar);
    }

    return () => {
      if (calendar) {
        calendar.destroy();
      }
    };
  }, [events]);

  // const handleAddOrUpdateEvent = async (eventData: any) => {
  //   if (selectedEvent) {
  //     await updateEvent(selectedEvent.id, eventData);
  //   } else {
  //     await addEvent(eventData);
  //   }
  //   setIsModalOpen(false);
  //   setSelectedEvent(null);
  // };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await deleteEvent(selectedEvent.id);
      setIsEventDetailModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleAddEvent = async () => {
    if (eventTimeRange && selectedDate && selectedPartner) {
      const [start] = eventTimeRange.split(" - ");
      const partner = partners.find((p) => p.name === selectedPartner);
      if (partner) {
        const startDateTime = new Date(`${selectedDate}T${start}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1시간 후

        const newEvent: Omit<Event, "id"> = {
          title: `${partner.name} - ${start}`,
          start: startDateTime.toISOString(),
          end: endDateTime.toISOString(),
          partnerName: partner.name,
          partnerColor: partner.color,
        };
        await addEvent(newEvent);
        setEventTimeRange("");
        setSelectedPartner(null);
        setIsAddEventModalOpen(false);
      } else {
        console.log("Partner not found");
      }
    } else {
      console.log("Missing required information");
    }
  };

  // const handleAddEvent = async () => {
  //   if (eventTimeRange && selectedDate && selectedPartner) {
  //     const [start, end] = eventTimeRange.split(" - ");
  //     const partner = partners.find((p) => p.name === selectedPartner);
  //     if (partner) {
  //       const newEvent: Omit<Event, "id"> = {
  //         title: `${partner.name} - ${start}`,
  //         start: `${selectedDate}T${start}`,
  //         end: `${selectedDate}T${end}`,
  //         partnerName: partner.name,
  //         partnerColor: partner.color,
  //       };
  //       await addEvent(newEvent);
  //       setEventTimeRange("");
  //       setSelectedPartner(null);
  //       setIsModalOpen(false);
  //     } else {
  //       console.log("Partner not found");
  //     }
  //   } else {
  //     console.log("Missing required information");
  //   }
  // };
  return (
    <>
      <div className="text-center">
        <h2 className="text-xl md:text-4xl text-black font-bold mb-12">
          일정 관리
        </h2>
      </div>
      <div>
        <div id="calendar" className="..."></div>
        <Modal
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
        >
          <h2 className="text-xl font-bold mb-4">{selectedDate}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className=" block text-sm font-medium text-gray-700">
                일정 선택
              </label>
              <div className="flex flex-wrap gap-2">
                {partners.map((partner) => (
                  <button
                    key={partner.id}
                    onClick={() => setSelectedPartner(partner.name)}
                    className={`px-3 py-1 rounded ${
                      selectedPartner === partner.name
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {partner.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className=" cublock text-sm font-medium text-gray-700">
                시간
              </label>
              <TimeRangePicker
                onChange={(value) => {
                  console.log("TimeRangePicker value:", value);
                  setEventTimeRange(value);
                }}
              />
            </div>
            <button
              onClick={handleAddEvent}
              className="w-full bg-slate-700 text-white py-2 rounded mt-4"
            >
              일정 추가
            </button>
          </div>
        </Modal>
        {/* 상세보기모달 */}
        <Modal
          isOpen={isEventDetailModalOpen}
          onClose={() => setIsEventDetailModalOpen(false)}
        >
          {selectedEvent && (
            <div>
              <h2 className="text-xl font-bold mb-4">일정 상세</h2>
              <p>날짜: {new Date(selectedEvent.start).toLocaleDateString()}</p>
              <p>이름: {selectedEvent.partnerName}</p>
              <p>
                시간: {new Date(selectedEvent.start).toLocaleTimeString()} -{" "}
                {new Date(selectedEvent.end).toLocaleTimeString()}
              </p>
              <button
                onClick={handleDeleteEvent}
                className="py-2 px-4 rounded mt-4 border border-gray-300 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                삭제
              </button>{" "}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Schedule;

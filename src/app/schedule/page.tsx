"use client";
import React, { useEffect, useState, useCallback } from "react";
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
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTimeRange, setEventTimeRange] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { partners, fetchPartners } = usePartnerStore();
  const { events, fetchEvents, addEvent, deleteEvent } = useEventStore();
  // const [events, setEvents] = useState<CustomEvent[]>([]);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  useEffect(() => {
    fetchEvents();
    fetchPartners();
  }, [fetchEvents, fetchPartners]);

  const handleDateSelect = useCallback((info: { startStr: string }) => {
    setSelectedDate(info.startStr);
    setIsAddEventModalOpen(true);
  }, []);

  const handleEventClick = useCallback((info: { event: EventApi }) => {
    const customEvent: Event = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      partnerName: info.event.extendedProps.partnerName,
      partnerColor: info.event.extendedProps.partnerColor,
    };

    console.log("Clicked event data:", customEvent); // 디버깅용
    setSelectedEvent(customEvent);
    setIsEventDetailModalOpen(true);
  }, []);

  // const handleEventClick = useCallback((info: { event: EventApi }) => {
  //   const customEvent: Event = {
  //     id: info.event.id,
  //     title: info.event.title,
  //     start: info.event.start ? info.event.startStr : "",
  //     end: info.event.end ? info.event.endStr : "",
  //     // start: info.event.startStr,
  //     // end: info.event.endStr,
  //     partnerName: info.event.extendedProps.partnerName,
  //     partnerColor: info.event.extendedProps.partnerColor,
  //   };
  //   setSelectedEvent(customEvent);
  //   setIsEventDetailModalOpen(true);
  // }, []);

  useEffect(() => {
    const calendarEl = document.getElementById("calendar");
    if (calendarEl) {
      const newCalendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        selectable: true,
        select: handleDateSelect,
        // select: (info) => {
        //   setSelectedDate(info.startStr);
        //   setIsAddEventModalOpen(true);
        // },
        events: events as EventInput[],
        eventClick: handleEventClick,
        // eventClick: (info: { event: EventApi }) => {
        //   const customEvent: Event = {
        //     id: info.event.id,
        //     title: info.event.title,
        //     start: info.event.startStr,
        //     end: info.event.endStr,
        //     partnerName: info.event.extendedProps.partnerName,
        //     partnerColor: info.event.extendedProps.partnerColor,
        //   };
        //   setSelectedEvent(customEvent);
        //   setIsEventDetailModalOpen(true);
        // },
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
      const [start, end] = eventTimeRange.split(" - ");
      const partner = partners.find((p) => p.name === selectedPartner);

      if (partner) {
        try {
          const startDateTime = `${selectedDate}T${start}`;
          const endDateTime = `${selectedDate}T${end}`;

          const newEvent: Omit<Event, "id"> = {
            title: `${partner.name} - ${start}~${end}`, // 시작과 끝 시간 모두 표시
            start: startDateTime,
            end: endDateTime,
            partnerName: partner.name,
            partnerColor: partner.color,
            // extendedProps 제거
          };
          console.log("Attempting to add event:", newEvent);
          await addEvent(newEvent);
          console.log("Event added successfully");

          setEventTimeRange("");
          setSelectedPartner(null);
          setIsAddEventModalOpen(false);
          await fetchEvents();
        } catch (error) {
          console.error("Error in handleAddEvent:", error);
        }
      }
    }
  };

  // const handleAddEvent = async () => {
  //   if (eventTimeRange && selectedDate && selectedPartner) {
  //     const [start, end] = eventTimeRange.split(" - ");
  //     const partner = partners.find((p) => p.name === selectedPartner);

  //     if (partner) {
  //       try {
  //         // 시작 시간과 종료 시간을 사용자가 선택한 값으로 설정
  //         const startDateTime = `${selectedDate}T${start}`;
  //         const endDateTime = `${selectedDate}T${end}`;

  //         console.log("Creating event with times:", {
  //           start: startDateTime,
  //           end: endDateTime,
  //           timeRange: eventTimeRange,
  //         });
  //         const newEvent: Omit<Event, "id"> = {
  //           title: `${partner.name} - ${start}`, // 시작과 끝 시간 모두 표시
  //           start: startDateTime,
  //           end: endDateTime,
  //           partnerName: partner.name,
  //           partnerColor: partner.color,
  //         };

  //         console.log("Attempting to add event:", newEvent);
  //         await addEvent(newEvent);
  //         console.log("Event added successfully");

  //         setEventTimeRange("");
  //         setSelectedPartner(null);
  //         setIsAddEventModalOpen(false);
  //       } catch (error) {
  //         console.error("Error in handleAddEvent:", error);
  //       }
  //     } else {
  //       console.log("Partner not found");
  //     }
  //   } else {
  //     console.log("Missing required information", {
  //       eventTimeRange,
  //       selectedDate,
  //       selectedPartner,
  //     });
  //   }
  // };

  // const handleAddEvent = async () => {
  //   if (eventTimeRange && selectedDate && selectedPartner) {
  //     const [start] = eventTimeRange.split(" - ");
  //     const partner = partners.find((p) => p.name === selectedPartner);

  //     if (partner) {
  //       try {
  //         // 날짜와 시간 형식을 문자열로 단순화
  //         const startDateTime = `${selectedDate}T${start}`;
  //         const endDateTime = new Date(`${selectedDate}T${start}`);
  //         endDateTime.setHours(endDateTime.getHours() + 1); // 1시간 추가

  //         const newEvent: Omit<Event, "id"> = {
  //           title: `${partner.name} - ${start}`,
  //           start: startDateTime, // ISO 문자열 대신 단순 문자열 사용
  //           end: endDateTime.toISOString().slice(0, 19), // 밀리초 부분 제거
  //           partnerName: partner.name,
  //           partnerColor: partner.color,
  //         };

  //         console.log("Attempting to add event:", newEvent); // 디버깅용
  //         await addEvent(newEvent);
  //         console.log("Event added successfully"); // 디버깅용

  //         setEventTimeRange("");
  //         setSelectedPartner(null);
  //         setIsAddEventModalOpen(false);
  //       } catch (error) {
  //         console.error("Error in handleAddEvent:", error); // 에러 로깅
  //       }
  //     } else {
  //       console.log("Partner not found");
  //     }
  //   } else {
  //     console.log("Missing required information", {
  //       eventTimeRange,
  //       selectedDate,
  //       selectedPartner,
  //     }); // 더 자세한 디버깅 정보
  //   }
  // };

  // const handleAddEvent = async () => {
  //   if (eventTimeRange && selectedDate && selectedPartner) {
  //     const [start] = eventTimeRange.split(" - ");
  //     const partner = partners.find((p) => p.name === selectedPartner);
  //     if (partner) {
  //       const startDateTime = new Date(`${selectedDate}T${start}`);
  //       const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1시간 후

  //       const newEvent: Omit<Event, "id"> = {
  //         title: `${partner.name} - ${start}`,
  //         start: startDateTime.toISOString(),
  //         end: endDateTime.toISOString(),
  //         partnerName: partner.name,
  //         partnerColor: partner.color,
  //       };
  //       await addEvent(newEvent);
  //       setEventTimeRange("");
  //       setSelectedPartner(null);
  //       setIsAddEventModalOpen(false);
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
              <p>날짜: {selectedEvent.start.split("T")[0]}</p>
              <p>이름: {selectedEvent.partnerName}</p>
              <p>
                시간:
                {selectedEvent.start.split("T")[1].substring(0, 5)} -{" "}
                {selectedEvent.end.split("T")[1].substring(0, 5)}
                {/* {selectedEvent.start.split("T")[1].slice(0, 5)} -{" "}
                {selectedEvent.end.split("T")[1].slice(0, 5)} */}
              </p>
              {/* <p>
                시간: {selectedEvent.start.split("T")[1]} -{" "}
                {selectedEvent.end.split("T")[1]}
              </p> */}
              <button
                onClick={handleDeleteEvent}
                className="py-2 px-4 rounded mt-4 border border-gray-300 hover:bg-gray-100 transition duration-200 ease-in-out"
              >
                삭제
              </button>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Schedule;

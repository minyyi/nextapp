"use client";
import { useEffect } from "react";
import { useEventStore } from "../store/useEventStore";
import PartnerStatsChart from "./Chart";

const ChartPage = () => {
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl md:text-4xl text-black font-bold mb-12">
          파트너 통계
        </h2>
      </div>
      <div>
        <PartnerStatsChart events={events} />
      </div>
    </>
  );
};

export default ChartPage;

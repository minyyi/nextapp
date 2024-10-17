import { create } from "zustand";

type CardItem = {
  icon: string;
  title: string;
  appTitle: string;
  button: string;
  desc: string;
  path: string;
};

// export type CardStore = {
//   cards: Array<{
//     icon: string;
//     title: string;
//     appTitle: string;
//     button: string;
//     desc: string;
//     path: string;
//   }>;
// };

export type CardStore = {
  cards: CardItem[];
};

export const useCardStore = create<CardStore>((set) => ({
  cards: [
    {
      icon: "FcCalendar",
      title: "일정 관리",
      appTitle: "달력",
      desc: "일정을 쉽게 기록하고 관리하세요",
      button: "기록 시작하기",
      path: "/schedule",
    },
    {
      icon: "SlPeople",
      title: "파트너 관리",
      appTitle: "등록",
      desc: "다양한 대상을 등록하고 관리하세요.",
      button: "등록 하기",
      path: "/add",
    },
    {
      icon: "FcBarChart",
      title: "월별 통계",
      appTitle: "통계",
      desc: "월별 수입과 근무 시간 통계를 한눈에 확인하세요",
      button: "차트 보기",
      path: "/chart",
    },
    // {
    //   icon: "",
    //   title: "수입 분석",
    //   appTitle: "분석",
    //   desc: "프로젝트별, 클라이언트별 수입을 분석합니다. ",
    //   button: "분석 하기",
    //   path: "#",
    // },
  ],
}));

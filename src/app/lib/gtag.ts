declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

type PageView = {
  url: string;
  title?: string;
};

type GAEvent = {
  action: string;
  category: string;
  label: string;
  value?: number;
};

// 페이지뷰 추적
export const pageview = ({ url, title }: PageView) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// 이벤트 추적
export const event = ({ action, category, label, value }: GAEvent) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

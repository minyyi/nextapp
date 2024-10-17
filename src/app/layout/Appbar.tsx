"use client";
import { useCardStore } from "../store/useCardStore";
import Link from "next/link";

const Appbar = () => {
  const cards = useCardStore((state: any) => state.cards);

  // const navigator = useNavigate();

  // const clickLogo = () => {
  //   navigator("/");
  // };

  return (
    <div className="h-16 border-b shadow-md sticky top-0 bg-white z-50">
      <div className="h-full px-6 flex justify-between">
        <div className="flex items-center space-x-8 hover:cursor-pointer hover:text-[#808080]">
          <Link href="/">
            <p className="font-bold text-3xl tracking-wider text-center">
              Paytrack
            </p>
          </Link>
        </div>
        <div className="flex items-center space-x-8 text-center">
          {cards.map((card: any) => (
            <Link key={card.title} href={card.path}>
              <p className="text-md hover:cursor-pointer hover:text-[#808080] hover:opacity-100">
                {card?.appTitle}
              </p>
            </Link>
          ))}
          <p className="text-md hover:cursor-pointer hover:text-[#808080] hover:opacity-100">
            로그아웃
          </p>
        </div>
      </div>
    </div>
  );
};

export default Appbar;

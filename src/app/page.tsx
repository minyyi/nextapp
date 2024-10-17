"use client";
import Card from "../app/component/common/Card";
import { useCardStore } from "../app/store/useCardStore";

const Home = () => {
  const cards = useCardStore((state: any) => state.cards);
  return (
    <div>
      <div>
        <header className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl text-black font-bold mb-4">
            프리랜서를 위한 스마트 급여 관리
          </h1>
          <p className="text-sm md:text-xl text-gray-600 mb-8">
            빠르고 쉽게 당신의 수입을 추적하고 관리하세요
          </p>
        </header>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 mx-10 my-20 md:grid-cols-2 gap-10">
        {cards.map((card: any) => (
          <Card key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Home;

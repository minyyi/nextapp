"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { usePartnerStore } from "../store/usePartnerStore";
import { FaClipboardCheck, FaTrash } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Partner } from "../store/usePartnerStore";

const defaultIconColor = "#000000";

const partnerFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "이름을 입력해주세요" })
    .max(50, { message: "이름이 너무 깁니다" }),
  hourlyRate: z
    .string()
    .min(1, { message: "시급을 입력해주세요" })
    .refine((val) => !isNaN(Number(val)), {
      message: "숫자만 입력 가능합니다",
    }),
  color: z.string().default("#ffffff"),
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

const Add = () => {
  const { partners, addPartner, deletePartner, fetchPartners } =
    usePartnerStore();
  const params = useParams();
  const id = params.id as string;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: "",
      hourlyRate: "",
      color: "#ffffff",
    },
  });

  // 현재 선택된 색상 값을 실시간으로 감시
  const selectedColor = watch("color");

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  useEffect(() => {
    if (id) {
      const partner = partners.find((p) => p.id === id);
      if (partner) {
        setValue("name", partner.name);
        setValue("hourlyRate", partner.hourlyRate.toString());
        setValue("color", partner.color);
      }
    }
  }, [id, partners, setValue]);

  const onSubmit = async (data: PartnerFormData) => {
    const partnerData: Omit<Partner, "id"> = {
      name: data.name,
      hourlyRate: parseFloat(data.hourlyRate),
      color: data.color,
    };

    if (id) {
      // updatePartner 로직이 추가되면 여기에 구현
    } else {
      await addPartner(partnerData);
    }
    reset();
  };

  const handleDelete = (id: string) => {
    deletePartner(id);
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-xl md:text-4xl text-black font-bold mb-12">
          파트너 관리
        </h2>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4">
        <div className="flex space-y-1.5 p-6 flex-row items-center justify-between">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            새 파트너 추가
          </h3>
          <div className="flex items-center gap-2 relative">
            <div className="relative w-10 h-10">
              <input
                type="color"
                {...register("color")}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <button
                type="button"
                className="w-10 h-10 rounded-md border border-gray-300 flex justify-center items-center cursor-pointer"
                style={{ backgroundColor: selectedColor }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-palette h-4 w-4"
                  style={{ color: "rgb(0, 0, 0)" }}
                >
                  <circle
                    cx="13.5"
                    cy="6.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                  <circle
                    cx="17.5"
                    cy="10.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
                  <circle
                    cx="6.5"
                    cy="12.5"
                    r=".5"
                    fill="currentColor"
                  ></circle>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="이름"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="시간당 급여"
                inputMode="numeric"
                {...register("hourlyRate")}
              />
              {errors.hourlyRate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hourlyRate.message}
                </p>
              )}
            </div>
            <div className="flex justify-between mt-2">
              <button
                className="text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
                type="submit"
              >
                {id ? "수정" : "추가"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex flex-col gap-4 rounded-lg border p-4"
          >
            <div className="flex gap-3 justify-between">
              <div className="flex gap-3 items-center">
                <FaClipboardCheck
                  size={30}
                  color={
                    partner.color !== "#ffffff"
                      ? partner.color
                      : defaultIconColor
                  }
                />
                <h2 className="text-xl font-semibold">{partner.name}</h2>
              </div>
              <div>
                <button onClick={() => handleDelete(partner.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
            <div>
              <p>시간당 급여: {partner.hourlyRate}원</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Add;

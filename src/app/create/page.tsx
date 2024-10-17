"use client";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 타입 단언 적용
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const body = (form.elements.namedItem("body") as HTMLTextAreaElement).value;

    const option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    };

    fetch(`http://localhost:9999/topics`, option)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const lastId = result?.id;
        router.push(`/read/${lastId}`);
        router.refresh();
      })
      .catch((error) => {
        console.error("Error:", error);
        // 에러 처리 로직
      });
  };
  return (
    <>
      <h1>Create!</h1>
      <form
        onSubmit={handleSubmit}
        //   (e) => {
        //   e.preventDefault();
        //   const title = e.target.title.value;
        //   const body = e.target.body.value;
        //   const option = {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ title, body }),
        //   };
        //   fetch(`http://localhost:9999/topics`, option)
        //     .then((res) => res.json())
        //     .then((result) => {
        //       console.log(result);
        //     });
        // }}
      >
        <p>
          <input key="title" type="text" name="title" placeholder="title" />
        </p>
        <p>
          <textarea key="body" name="body" id="" placeholder="body"></textarea>
        </p>
        <div>
          <input type="submit"></input>
        </div>
      </form>
    </>
  );
}

"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Update() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetch(`http://localhost:9999/topics/${id}`)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setTitle(result.title);
        setBody(result.body);
      })
      .catch((error) => console.error("Failed to fetch topic:", error));
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const option = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    };

    fetch(`http://localhost:9999/topics/${id}`, option)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        router.push(`/read/${id}`);
        router.refresh();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <h1>Update: {title}</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </p>
        <div>
          <input type="submit" value="Update" />
        </div>
      </form>
    </>
  );
}

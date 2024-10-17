"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export function Control() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      const options = { method: "DELETE" };
      fetch(`http://localhost:9999/topics/${id}`, options)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete");
          return res.json();
        })
        .then(() => {
          router.push("/");
          router.refresh();
        })
        .catch((error) => {
          console.error("Error deleting topic:", error);
          alert("Failed to delete the item. Please try again.");
        });
    }
  };

  return (
    <ul>
      <li>
        <Link href="/create">create</Link>
      </li>
      {id ? (
        <>
          <li>
            <Link href={"/update/" + id}>update</Link>
          </li>
          <li>
            <input type="button" value="delete" onClick={handleDelete} />
          </li>
        </>
      ) : null}
    </ul>
  );
}

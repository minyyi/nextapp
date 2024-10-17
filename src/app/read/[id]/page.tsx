export default async function Read(props: any) {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Topic ID:", props.params.id);
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/topics/${props.params.id}`,
      { cache: "no-store" }
    );

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const topic = await resp.json();

    return (
      <>
        <h2>{topic?.title}</h2>
        <div>{topic?.body}</div>
      </>
    );
  } catch (error: unknown) {
    console.error("Error in Read component:", error);
    return (
      <div>
        Error loading topic:{" "}
        {error instanceof Error ? error.message : "An unknown error occurred"}
      </div>
    );
  }
}

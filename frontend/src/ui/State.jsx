// Loading / error / empty messages in the same quiet style.
export function Loading() {
  return <p className="note" role="status">Loading…</p>;
}

export function ErrorNote({ error }) {
  return (
    <p className="note note--error" role="alert">
      Could not reach the server. Make sure the backend is running on port 8080.
      {error?.message ? ` (${error.message})` : ""}
    </p>
  );
}

export function Empty({ children }) {
  return <p className="note">{children}</p>;
}

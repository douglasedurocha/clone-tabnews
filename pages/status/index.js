import { useQuery } from "@tanstack/react-query";

async function getStatus() {
  const response = await fetch("/api/v1/status");
  return response.json();
}

export default function StatusPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
    refetchInterval: 2000,
  });

  return (
    <div>
      <h1>Status</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Updated At: {data.updated_at}</p>
          <h3>Database:</h3>
          <ul>
            <li>Version: {data.dependencies.database.version}</li>
            <li>
              Max Connections: {data.dependencies.database.max_connections}
            </li>
            <li>
              Opened Connections:{" "}
              {data.dependencies.database.opened_connections}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

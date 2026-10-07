import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utlis/customAPI";
import { apiError } from "../../../utlis/common";
import { PageHeader } from "../../../components/PageHeader";
import { SimpleTable } from "../../../components/SimpleTable";
import { Pagination } from "../../../components/Pagination";
import { RoleGate } from "../../../components/RoleGate";
import { canViewDeletions, ROLE_LABEL } from "../../../utlis/roles";
import { usePage } from "../../../utlis/usePage";

function Activity() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["deletions"],
    queryFn: async () => {
      const response = await api.get("/audit");
      return response.data.data;
    },
  });

  const records = Array.isArray(data) ? data : [];
  const { page, setPage, totalPages, rows } = usePage(records);

  const columns = [
    {
      key: "when",
      header: "When",
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "who",
      header: "Who",
      cell: (row) => {
        const name = `${row.deletedBy?.firstName || ""} ${row.deletedBy?.lastName || ""}`.trim();
        const role = ROLE_LABEL[row.deletedBy?.role] || row.deletedBy?.role;
        return `${name || row.deletedBy?.email} (${role})`;
      },
    },
    { key: "what", header: "Deleted", cell: (row) => row.summary },
    { key: "type", header: "Record", cell: (row) => `${row.entityType} #${row.entityId}` },
  ];

  return (
    <RoleGate allow={canViewDeletions}>
      <div className="pr-[52px] pt-6">
        <PageHeader
          title="Deletion log"
          subtitle="When a manager or admin deletes a product, the store keeps who did it and what the product was."
        />
        {isLoading ? <p className="font-[monospace]">Loading records...</p> : null}
        {isError ? <p className="text-red-600 font-[monospace]">{apiError(error)}</p> : null}
        {data ? (
          <>
            <SimpleTable columns={columns} rows={rows} empty="No deletions yet." />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : null}
      </div>
    </RoleGate>
  );
}

export { Activity };

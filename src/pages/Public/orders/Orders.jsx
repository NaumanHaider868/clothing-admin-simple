import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../../../utlis/customAPI";
import { apiError } from "../../../utlis/common";
import { PageHeader } from "../../../components/PageHeader";
import { SimpleTable } from "../../../components/SimpleTable";
import { Pagination } from "../../../components/Pagination";
import { RoleGate } from "../../../components/RoleGate";
import { canManageOrders } from "../../../utlis/roles";
import { usePage } from "../../../utlis/usePage";

const money = (value) => Number(value || 0).toFixed(2);

function Orders() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/order");
      return response.data.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(`/order/${id}/status`, { status });
      return response.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
    },
    onError: (err) => toast.error(apiError(err, "Could not update the order")),
  });

  const orders = Array.isArray(data) ? data : [];
  const { page, setPage, totalPages, rows } = usePage(orders);

  const columns = [
    { key: "id", header: "Order", cell: (row) => `#${row.id}` },
    {
      key: "customer",
      header: "Customer",
      cell: (row) => row.user?.email || "-",
    },
    {
      key: "items",
      header: "Items",
      cell: (row) =>
        row.items.map((item) => `${item.quantity} × ${item.productName} (${item.size})`).join(", "),
    },
    { key: "total", header: "Total", cell: (row) => money(row.total) },
    {
      key: "status",
      header: "Status",
      cell: (row) =>
        row.status === "PLACED" ? (
          <select
            defaultValue=""
            className="bg-transparent border-b border-black py-1"
            onChange={(event) => {
              if (!event.target.value) return;
              statusMutation.mutate({ id: row.id, status: event.target.value });
            }}
          >
            <option value="">Placed</option>
            <option value="FULFILLED">Fulfill</option>
            <option value="CANCELLED">Cancel</option>
          </select>
        ) : (
          row.status
        ),
    },
    {
      key: "date",
      header: "Placed",
      cell: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <RoleGate allow={canManageOrders}>
      <div className="pr-[52px] pt-6">
        <PageHeader
          title="Orders"
          subtitle="Customers can place an order from the cart. Payment is not collected yet. Fulfill an order when it should count as store earnings. Cancelling a placed order puts the stock back."
        />
        {isLoading ? <p className="font-[monospace]">Loading orders...</p> : null}
        {isError ? <p className="text-red-600 font-[monospace]">{apiError(error)}</p> : null}
        {data ? (
          <>
            <SimpleTable columns={columns} rows={rows} empty="No orders yet." />
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : null}
      </div>
    </RoleGate>
  );
}

export { Orders };

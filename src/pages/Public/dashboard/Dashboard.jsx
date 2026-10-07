import { useQuery } from "@tanstack/react-query";
import { api } from "../../../utlis/customAPI";
import { apiError } from "../../../utlis/common";
import { PageHeader } from "../../../components/PageHeader";
import { RoleGate } from "../../../components/RoleGate";
import { canViewEarnings } from "../../../utlis/roles";

const money = (value) =>
  Number(value || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });

function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["earnings"],
    queryFn: async () => {
      const response = await api.get("/dashboard/earnings");
      return response.data.data;
    },
  });

  const cards = [
    { label: "Earned", value: money(data?.earned), note: "Fulfilled orders" },
    { label: "Waiting", value: money(data?.pending), note: "Placed, not fulfilled" },
    { label: "Fulfilled orders", value: data?.fulfilledOrders ?? 0 },
    { label: "Open orders", value: data?.placedOrders ?? 0 },
    { label: "Cancelled", value: data?.cancelledOrders ?? 0 },
    { label: "Products", value: data?.productCount ?? 0 },
  ];

  return (
    <RoleGate allow={canViewEarnings}>
      <div className="pr-[52px] pt-6">
        <PageHeader
          title="Earnings"
          subtitle="Payments are not connected yet. Earned revenue is the total of orders marked fulfilled. Placed orders stay in Waiting until a manager fulfills them."
        />
        {isLoading ? <p className="font-[monospace]">Loading earnings...</p> : null}
        {isError ? <p className="font-[monospace] text-red-600">{apiError(error)}</p> : null}
        {data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="border border-gray-200 rounded-lg p-5">
                <div className="text-sm text-gray-500 font-[monospace]">{card.label}</div>
                <div className="text-2xl mt-2 font-[monospace]">{card.value}</div>
                {card.note ? (
                  <div className="text-xs text-gray-500 mt-2 font-[monospace]">{card.note}</div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </RoleGate>
  );
}

export { Dashboard };

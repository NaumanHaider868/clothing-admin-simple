import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../../../utlis/customAPI";
import { apiError } from "../../../utlis/common";
import { PageHeader } from "../../../components/PageHeader";
import { RoleGate } from "../../../components/RoleGate";
import { canWriteProducts } from "../../../utlis/roles";

const fields = [
  ["name", "Yes", "Product name"],
  ["price", "Yes", "Number greater than 0"],
  ["gender", "Yes", "men, women, kids, or unisex"],
  ["collectionType", "Yes", "men, women, boys, girls, unisex, or other"],
  ["variants", "Yes", "One or more variant blocks"],
  ["variant/color", "Yes", "Color name or hex, such as #112233"],
  ["variant/images/image", "Yes", "One or more http(s) image URLs. Files are not embedded."],
  ["variant/sizes/size/label", "Yes", "Size label, such as S, M, or 32"],
  ["variant/sizes/size/stockCount", "Yes", "Whole number, 0 or more"],
  ["description", "No", "Text"],
  ["collection", "No", "Group name, such as Shirts or Jackets"],
  ["modelDetail", "No", "Fit note"],
  ["isPublic", "No", "true or false. Defaults to true"],
  ["type", "No", "Season or type, such as summer"],
  ["onSale", "No", "true or false. Defaults to false"],
  ["discountPercent", "No", "0 to 80. Defaults to 0"],
  ["inStock", "No", "true or false. Defaults to true"],
];

function BulkImport() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const sample = useQuery({
    queryKey: ["import-sample"],
    queryFn: async () => {
      const response = await api.get("/product/import/sample");
      return response.data;
    },
  });

  const importMutation = useMutation({
    mutationFn: async (selected) => {
      const body = new FormData();
      body.append("file", selected);
      const response = await api.post("/product/import", body);
      return response.data;
    },
    onSuccess: (response) => {
      setResult(response.data);
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(apiError(error, "Import failed")),
  });

  const downloadSample = () => {
    if (!sample.data) return;
    const blob = new Blob([sample.data], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-import-sample.xml";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <RoleGate allow={canWriteProducts}>
      <div className="pr-[52px] pt-6 max-w-4xl">
        <PageHeader
          title="Bulk upload"
          subtitle="Upload one XML file to add many products. Each product that fails is reported, and the valid ones are still saved."
        />
        <form
          className="flex flex-wrap items-center gap-3 mb-8"
          onSubmit={(event) => {
            event.preventDefault();
            if (!file) {
              toast.error("Choose an XML file");
              return;
            }
            importMutation.mutate(file);
          }}
        >
          <input
            type="file"
            accept=".xml,text/xml,application/xml"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <button
            type="submit"
            disabled={importMutation.isPending}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Upload
          </button>
          <button
            type="button"
            onClick={downloadSample}
            disabled={!sample.data}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Download sample
          </button>
        </form>

        {result ? (
          <div className="mb-8 font-[monospace] text-sm">
            <p>
              Saved {result.createdCount}. Failed {result.failedCount}.
            </p>
            {result.failed?.length ? (
              <ul className="mt-3 space-y-1 text-red-700">
                {result.failed.map((item) => (
                  <li key={`${item.index}-${item.name}`}>
                    Product {item.index}
                    {item.name ? ` (${item.name})` : ""}: {item.message}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <h2 className="font-[monospace] text-lg mb-3">XML fields</h2>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase">
              <tr>
                <th className="px-3 py-2 font-[monospace]">Field</th>
                <th className="px-3 py-2 font-[monospace]">Required</th>
                <th className="px-3 py-2 font-[monospace]">Value</th>
              </tr>
            </thead>
            <tbody>
              {fields.map(([field, required, value]) => (
                <tr key={field} className="border-b">
                  <td className="px-3 py-2 font-[monospace]">{field}</td>
                  <td className="px-3 py-2 font-[monospace]">{required}</td>
                  <td className="px-3 py-2 font-[monospace]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <pre className="text-xs bg-gray-50 border border-gray-200 p-4 overflow-x-auto font-[monospace]">
          {sample.isError
            ? "The sample could not be loaded. The field list above is the format to follow."
            : sample.data || "Loading sample..."}
        </pre>
      </div>
    </RoleGate>
  );
}

export { BulkImport };

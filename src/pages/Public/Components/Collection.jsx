import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import "../../../assets/css/style.scss";
import { api } from "../../../utlis/customAPI";
import { useQuery } from "@tanstack/react-query";
import TableSkeleton from "../../../utlis/shimmar/table";
import { productColumns } from "../columns/mainColumns";

export default function Collection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/product/all");
      return response.data;
    },
  });

  const products = Array.isArray(data?.data) ? data.data : [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (product) => console.log("Edit:", product);
  const handleDelete = (id) => console.log("Delete:", id);

  const columnHelper = createColumnHelper();
  const columns = productColumns(handleEdit, handleDelete);
  const table = useReactTable({
    data: paginatedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="w-full pr-[52px]">
        <TableSkeleton columnsCount={columns.length} rowsCount={6} />
      </div>
    );
  }

  return (
    <div className="collection w-full pr-[52px]">
      <div className="mt-10 overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            className="px-3 py-1 font-[monospace] rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 font-[monospace] rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

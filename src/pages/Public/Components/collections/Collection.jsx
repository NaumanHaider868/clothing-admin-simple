import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import "../../../../assets/css/style.scss";
import { api } from "../../../../utlis/customAPI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TableSkeleton from "../../../../utlis/shimmar/table";
import { productColumns } from "../../columns/mainColumns";
import ErrorHandler from "../../../../utlis/common";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Collection = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/product/all");
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/product/delete/${productId}`);
      return productId;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["products"], (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: oldData.data.filter((product) => product.id !== deletedId),
        };
      });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
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

  // Use useCallback to prevent unnecessary recreations
  const handleEdit = useCallback((id) => {
    console.log(id);
    navigate(`/product_action`, { state: { id } });
  }, [navigate]);

  // Fix: Remove deleteMutation from dependencies and use the stable mutate function
  const handleDelete = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  }, []); // Remove deleteMutation from dependencies

  // Use useMemo to recreate columns only when handlers change
  const columns = useMemo(() => 
    productColumns(handleEdit, handleDelete),
    [handleDelete, handleEdit]
  );

  const table = useReactTable({
    data: paginatedProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  if (isLoading) {
    return (
      <div className="w-full pr-[52px]">
        <TableSkeleton columnsCount={columns.length} rowsCount={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorHandler
        error={error}
        message="Unable to load products"
        handleReFetch={refetch}
      />
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
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActionCell = String(cell.column.id)
                      .toLowerCase()
                      .includes("action");
                    const cellContent = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    );

                    return (
                      <td key={cell.id} className="px-4 py-3">
                        {isActionCell ? (
                          cellContent
                        ) : (
                          <Link
                            to={`/product/${row.original.id}`}
                            className="block w-full h-full"
                          >
                            {cellContent}
                          </Link>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {products.length > 0 && (
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
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
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
};
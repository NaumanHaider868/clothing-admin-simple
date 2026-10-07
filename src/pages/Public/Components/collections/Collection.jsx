import { useState, useEffect, useMemo, useCallback } from "react";
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
import ErrorHandler, { apiError } from "../../../../utlis/common";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageHeader } from "../../../../components/PageHeader";
import { Pagination } from "../../../../components/Pagination";
import { ConfirmDialog } from "../../../../components/ConfirmDialog";
import { usePage } from "../../../../utlis/usePage";
import { useAuth } from "../../../../context/AuthContext";
import { canDeleteProducts, canWriteProducts } from "../../../../utlis/roles";
import { seasonLabel } from "../../../../utlis/seasons";

export const Collection = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const season = (searchParams.get("season") || "").toLowerCase();
  const [search, setSearch] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);

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
      toast.error(apiError(error, "Failed to delete product"));
    },
  });

  const products = useMemo(
    () => (Array.isArray(data?.data) ? data.data : []),
    [data]
  );
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSeason = !season || product.type?.toLowerCase() === season;
      const matchesSearch = !term || product.name?.toLowerCase().includes(term);
      return matchesSeason && matchesSearch;
    });
  }, [products, search, season]);
  const { page, setPage, totalPages, rows } = usePage(filtered);

  const handleEdit = useCallback(
    (id) => {
      navigate(`/product_action`, { state: { id } });
    },
    [navigate]
  );

  const handleDelete = useCallback((id) => {
    setPendingDelete(id);
  }, []);

  const columns = useMemo(
    () =>
      productColumns(handleEdit, handleDelete, {
        canEdit: canWriteProducts(user?.role),
        canDelete: canDeleteProducts(user?.role),
      }),
    [handleDelete, handleEdit, user?.role]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    manualPagination: true,
    autoResetPageIndex: false,
  });

  useEffect(() => {
    setPage(1);
  }, [search, season, setPage]);

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
    <div className="collection w-full pr-[52px] pt-6">
      <PageHeader
        title={season ? seasonLabel(season) : "Products"}
        action={
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name"
            className="py-2 px-3 border-b border-black bg-transparent font-[monospace]"
          />
        }
      />
      <div className="overflow-x-auto bg-white rounded-lg shadow">
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
            {table.getCoreRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center font-[monospace] text-gray-500">
                  No products match this list.
                </td>
              </tr>
            ) : null}
            {table.getCoreRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.original.id}
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

                    if (isActionCell) {
                      return (
                        <td key={cell.id} className="px-4 py-3">
                          {cellContent}
                        </td>
                      );
                    }

                    return (
                      <td key={cell.id} className="px-4 py-3">
                        <Link
                          to={`/product/${row.original.id}`}
                          className="block w-full h-full hover:text-blue-600 transition-colors"
                        >
                          {cellContent}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete product"
        message="This removes the product. The deletion log will store your name and the product."
        confirmLabel="Delete"
        busy={deleteMutation.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteMutation.mutate(pendingDelete, {
            onSettled: () => setPendingDelete(null),
          });
        }}
      />
    </div>
  );
};

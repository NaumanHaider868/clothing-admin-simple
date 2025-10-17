import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { MdEdit, MdDelete } from "react-icons/md";
import "../../../assets/css/style.scss";
import noImage from "../../../assets/img/NoImage.jpg";
import { api } from "../../../utlis/customAPI";
import { useQuery } from "@tanstack/react-query";

export default function Collection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const payload = {};
      const response = await api.post("/product/all", payload);
      return response.data;
    },
  });
  console.log(data);
  const products = Array.isArray(data?.data) ? data.data : [];

  const handleEdit = (product) => console.log("Edit:", product);
  const handleDelete = (id) => console.log("Delete:", id);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("image", {
      header: <div className="font-[monospace] font-xs">Image</div>,
      cell: (info) => {
        const product = info.row.original;
        const firstImage =
          product?.variants?.[0]?.images?.[0]?.imageUrl || noImage;
        return (
          <img
            src={firstImage}
            alt={product.name}
            className="w-12 h-12 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = noImage;
            }}
          />
        );
      },
    }),
    columnHelper.accessor("name", {
      header: <div className="font-[monospace]">Name</div>,
      cell: (info) => (
        <span className="font-[monospace]">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("colors", {
      header: <div className="font-[monospace]">Colors</div>,
      cell: (info) => {
        const colors =
          info.row.original?.variants?.map((v) => v.color).filter(Boolean) ||
          [];
        return (
          <div className="flex gap-2">
            {colors.length ? (
              colors.map((c) => (
                <div
                  key={c}
                  title={c}
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("sizes", {
      header: <div className="font-[monospace]">Sizes</div>,
      cell: (info) => {
        const allSizes =
          info.row.original?.variants?.flatMap((v) =>
            v.sizes?.map((s) => s.size)
          ) || [];
        const uniqueSizes = [...new Set(allSizes)];
        return (
          <span className="font-[monospace]">
            {uniqueSizes.length ? uniqueSizes.join(", ") : "-"}
          </span>
        );
      },
    }),
    columnHelper.accessor("collectionType", {
      header: <div className="font-[monospace]">Collection</div>,
      cell: (info) => {
        return (
          <span className="font-[monospace] capitalize">{info.getValue()}</span>
        );
      },
    }),
    columnHelper.accessor("gender", {
      header: <div className="font-[monospace]">Gender</div>,
      cell: (info) => {
        return (
          <span className="font-[monospace] capitalize">{info.getValue()}</span>
        );
      },
    }),
    columnHelper.accessor("isPublic", {
      header: <div className="font-[monospace]">Visibility</div>,
      cell: (info) => {
        return (
          <span className="font-[monospace]">
            {info.getValue() ? "Public" : "Private"}
          </span>
        );
      },
    }),
    columnHelper.accessor("onSale", {
      header: <div className="font-[monospace]">On Sale</div>,
      cell: (info) => {
        return (
          <span className="font-[monospace]">
            {info.getValue() ? "Yes" : "No"}
          </span>
        );
      },
    }),
    columnHelper.accessor("discountPercent", {
      header: <div className="font-[monospace]">Discount</div>,
      cell: (info) => {
        return (
          <span className="font-[monospace]">
            {info.row.original.discountPercent}%
          </span>
        );
      },
    }),
    columnHelper.accessor("price", {
      header: <div className="font-[monospace]">Price</div>,
      cell: (info) => {
        const finalPrice = info.row.original.discountPercent
          ? info.row.original.price -
            (info.row.original.price * info.row.original.discountPercent) / 100
          : info.row.original.price;
        return (
          <div className="font-[monospace] flex gap-1">
            {info.row.original.discountPercent && (
              <span className="line-through text-[12px]">
                {Number(info.getValue()).toFixed(2)}
              </span>
            )}
            <span>{Number(finalPrice).toFixed(2)}</span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: <div className="font-[monospace]">Actions</div>,
      cell: (info) => {
        const product = info.row.original;
        return (
          <div className="flex justify-center gap-2">
            <button
              className="bg-gray-300 text-black p-2 rounded-full hover:bg-gray-400 transition"
              onClick={() => handleEdit(product)}
            >
              <MdEdit size={18} />
            </button>
            <button
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
              onClick={() => handleDelete(product.id)}
            >
              <MdDelete size={18} />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    </div>
  );
}

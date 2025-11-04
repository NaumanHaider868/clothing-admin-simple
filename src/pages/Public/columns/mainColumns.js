import { createColumnHelper } from "@tanstack/react-table";
import { MdEdit, MdDelete } from "react-icons/md";
import noImage from "../../../assets/img/NoImage.jpg";
import React from "react";

const columnHelper = createColumnHelper();

// Custom Image Component to prevent blinking
const ProductImage = ({ product }) => {
  const [imgSrc, setImgSrc] = React.useState(noImage);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const firstImage = product?.variants?.[0]?.images?.[0]?.imageUrl;
    
    if (firstImage) {
      setImgSrc(firstImage);
      setHasError(false);
    } else {
      setImgSrc(noImage);
      setHasError(true);
    }
  }, [product]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(noImage);
      setHasError(true);
    }
  };

  return (
    <div className="image-container">
      <img
        src={imgSrc}
        alt={product.name}
        className="w-12 h-12 object-cover rounded border"
        onError={handleError}
      />
    </div>
  );
};

export const productColumns = (handleEdit, handleDelete) => [
  columnHelper.accessor("image", {
    header: <div className="font-[monospace] font-xs">Image</div>,
    cell: (info) => {
      return <ProductImage product={info.row.original} />;
    },
  }),

  columnHelper.accessor("name", {
    header: <div className="font-[monospace]">Name</div>,
    cell: (info) => <span className="font-[monospace]">{info.getValue()}</span>,
  }),

  columnHelper.accessor("colors", {
    header: <div className="font-[monospace]">Colors</div>,
    cell: (info) => {
      const colors =
        info.row.original?.variants?.map((v) => v.color).filter(Boolean) || [];
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
    cell: (info) => (
      <span className="font-[monospace] capitalize">{info.getValue()}</span>
    ),
  }),

  columnHelper.accessor("gender", {
    header: <div className="font-[monospace]">Gender</div>,
    cell: (info) => (
      <span className="font-[monospace] capitalize">{info.getValue()}</span>
    ),
  }),

  columnHelper.accessor("isPublic", {
    header: <div className="font-[monospace]">Visibility</div>,
    cell: (info) => (
      <span className="font-[monospace]">
        {info.getValue() ? "Public" : "Private"}
      </span>
    ),
  }),

  columnHelper.accessor("onSale", {
    header: <div className="font-[monospace]">On Sale</div>,
    cell: (info) => (
      <span className="font-[monospace]">{info.getValue() ? "Yes" : "No"}</span>
    ),
  }),

  columnHelper.accessor("discountPercent", {
    header: <div className="font-[monospace]">Discount</div>,
    cell: (info) => (
      <span className="font-[monospace]">
        {info.row.original.discountPercent}%
      </span>
    ),
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
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(product.id);
            }}
            aria-label="Edit product"
          >
            <MdEdit size={18} />
          </button>
          <button
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(product.id);
            }}
          >
            <MdDelete size={18} />
          </button>
        </div>
      );
    },
  }),
];
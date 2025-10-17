import React from "react";
import "../../../assets/css/style.scss";
import noImage from "../../../assets/img/NoImage.jpg";
import { MdEdit, MdDelete } from "react-icons/md";

const apiResponse = {
  status: "success",
  data: [
    {
      id: 5,
      name: "Basic Jogger Trousers",
      description:
        "Get ready to lounge in style with our Basic Jogger Trousers. Made from soft cotton, these joggers provide both comfort and a fashionable look. Perfect for everyday wear, these regular fit jog",
      price: "15",
      collection: "Winter 2025",
      modelDetail: "The model is wearing size: L; Model height: 5.11ft",
      isPublic: true,
      gender: "men",
      collectionType: "boys",
      type: "",
      onSale: false,
      discountPercent: "0",
      inStock: true,
      createdAt: "2025-10-11T23:28:09.484Z",
      updatedAt: "2025-10-11T23:28:09.484Z",
      variants: [
        {
          id: 5,
          productId: 5,
          color: "#4B4841",
          images: [
            {
              id: 13,
              variantId: 5,
              imageUrl:
                "https://outfitters.com.pk/cdn/shop/files/F0536108117_3_10988177-3d8e-44e9-9da5-68b34b4b40bc.jpg?v=1758089830",
            },
            {
              id: 14,
              variantId: 5,
              imageUrl:
                "https://outfitters.com.pk/cdn/shop/files/F0536108117_4_9fbd8d5d-56f1-4085-bcca-3965fdd654bb.jpg?v=1758089830",
            },
            {
              id: 15,
              variantId: 5,
              imageUrl:
                "https://outfitters.com.pk/cdn/shop/files/F0536108117_5_e32e61e3-064a-4a3c-846e-14183302ca6f.jpg?v=1758089830",
            },
          ],
          sizes: [
            { id: 15, variantId: 5, size: "S", stockCount: 25 },
            { id: 16, variantId: 5, size: "M", stockCount: 20 },
            { id: 17, variantId: 5, size: "L", stockCount: 25 },
            { id: 18, variantId: 5, size: "XL", stockCount: 15 },
          ],
        },
        {
          id: 6,
          productId: 5,
          color: "#1D1D1D",
          images: [
            {
              id: 16,
              variantId: 6,
              imageUrl:
                "https://outfitters.com.pk/cdn/shop/files/F0536108901_1_6ed3d000-78e2-4cb6-877f-bd658c6941de.jpg?v=1755088615",
            },
            {
              id: 17,
              variantId: 6,
              imageUrl:
                "https://outfitters.com.pk/cdn/shop/files/F0536108901_3_f28588cf-192d-4a44-a593-525cf31be1c5.jpg?v=1755088615",
            },
            {
              id: 18,
              variantId: 6,
              imageUrl:
                "https://outfitters.com.pk/cdn/shop/files/F0536108901_2_8ad85995-2e8d-4b59-8bb0-93a3f90485cb.jpg?v=1755088615",
            },
          ],
          sizes: [
            { id: 19, variantId: 6, size: "M", stockCount: 20 },
            { id: 20, variantId: 6, size: "L", stockCount: 25 },
            { id: 21, variantId: 6, size: "XL", stockCount: 15 },
          ],
        },
      ],
    },
  ],
  message: "Products fetched successfully",
};

const products = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

export default function Collection() {
  const handleEdit = (product) => {
    console.log("Edit product", product);
  };

  const handleDelete = (productId) => {
    console.log("Delete product", productId);
  };

  return (
    <div className="collection w-full pr-[52px]">
      <div className="mt-10 overflow-x-auto">
        <div className="min-w-[900px] md:min-w-full">
          <div className="flex flex-col gap-4">
            {products.map((p) => (
              <ProductListRow
                key={p.id}
                product={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListRow({ product, onEdit, onDelete }) {
  const firstImage = product?.variants?.[0]?.images?.[0]?.imageUrl || noImage;

  const colors = product?.variants?.map((v) => v.color).filter(Boolean) || [];

  const allSizes = product?.variants?.flatMap((v) =>
    v.sizes?.map((s) => s.size)
  );
  const uniqueSizes = Array.from(new Set(allSizes));

  const priceNum = Number(product?.price);
  const discount = Number(product?.discountPercent || 0);
  const finalPrice = (priceNum * (1 - discount / 100)).toFixed(2);

  return (
    <div
      className="
        grid 
        grid-cols-[80px_1fr_1fr_1fr_auto_auto_auto_auto_120px] 
        md:grid-cols-[70px_1fr_1fr_1fr_auto_auto_auto_auto_100px]
        sm:grid-cols-[60px_1fr_1fr_1fr_auto_auto_auto_auto_80px]
        items-center 
        border-b 
        last:border-b-0 
        bg-white 
        rounded-lg 
        p-3 
        gap-2 
        text-[0.9rem]
        shadow-sm
      "
    >
      <div className="py-2 pr-2 flex justify-center">
        <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={firstImage}
            alt={product?.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = noImage;
            }}
          />
        </div>
      </div>

      <div className="py-2 pr-2 font-[monospace]">{product?.name}</div>
      <div className="py-2 pr-2 font-[monospace]">
        <div className="flex gap-2">
          {colors.length
            ? colors.map((color) => (
                <div
                  key={color}
                  title={color}
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))
            : "-"}
        </div>
      </div>
      <div className="py-2 pr-2 font-[monospace]">
        {uniqueSizes.length ? uniqueSizes.join(", ") : "-"}
      </div>
      <div className="py-2 pr-2 font-[monospace]">${priceNum.toFixed(2)}</div>
      <div className="py-2 pr-2 font-[monospace]">
        {product?.onSale ? "Yes" : "No"}
      </div>
      <div className="py-2 pr-2 font-[monospace]">
        {product?.onSale ? `$${finalPrice}` : "-"}
      </div>
      <div className="py-2 pr-2 font-[monospace]">
        {product?.isPublic ? "Public" : "Private"}
      </div>
      <div className="py-2 pr-2">
        <div className="flex justify-end gap-2">
          <button
            className="bg-[#D9D9D9] text-black cursor-pointer p-2.5 rounded-full hover:bg-gray-300 transition"
            onClick={() => onEdit && onEdit(product)}
          >
            <MdEdit size={18} />
          </button>
          <button
            className="bg-black text-white cursor-pointer p-2.5 rounded-full hover:bg-gray-800 transition"
            onClick={() => onDelete && onDelete(product?.id)}
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

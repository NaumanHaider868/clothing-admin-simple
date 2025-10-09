import React from "react";
import "../../../assets/css/style.scss";
import image from "../../../assets/img/cloth1.png";
const apiResponse = {
  status: "success",
  data: [
    {
      id: 2,
      name: "Nike Air Max 2025",
      price: "149.99",
      onSale: true,
      inStock: true,
      type: null,
      images: [],
      variants: [],
    },
    {
      id: 3,
      name: "Levi’s Denim Jacket 2025",
      price: "89.98999999999999",
      onSale: true,
      inStock: true,
      type: null,
      images: [
        {
          id: 7,
          productId: 3,
          imageUrl: "https://example.com/images/levis-jacket-front.jpg",
        },
        {
          id: 8,
          productId: 3,
          imageUrl: "https://example.com/images/levis-jacket-back.jpg",
        },
        {
          id: 9,
          productId: 3,
          imageUrl: "https://example.com/images/levis-jacket-model.jpg",
        },
      ],
      variants: [
        { id: 9, productId: 3, color: "Blue", size: "M", stockCount: 50 },
        { id: 10, productId: 3, color: "Blue", size: "L", stockCount: 60 },
        { id: 11, productId: 3, color: "Black", size: "XL", stockCount: 40 },
        { id: 12, productId: 3, color: "Green", size: "S", stockCount: 50 },
      ],
    },
    {
      id: 4,
      name: "Nike Boys Windbreaker Jacket 2025",
      price: "89.98999999999999",
      onSale: true,
      inStock: true,
      type: "jackets",
      images: [
        {
          id: 10,
          productId: 4,
          imageUrl: "https://example.com/images/nike-boys-jacket-front.jpg",
        },
        {
          id: 11,
          productId: 4,
          imageUrl: "https://example.com/images/nike-boys-jacket-back.jpg",
        },
        {
          id: 12,
          productId: 4,
          imageUrl: "https://example.com/images/nike-boys-jacket-side.jpg",
        },
      ],
      variants: [
        { id: 13, productId: 4, color: "Navy Blue", size: "S", stockCount: 20 },
        {
          id: 14,
          productId: 4,
          color: "Olive Green",
          size: "M",
          stockCount: 25,
        },
        { id: 15, productId: 4, color: "Black", size: "L", stockCount: 15 },
        { id: 16, productId: 4, color: "Red", size: "XL", stockCount: 20 },
      ],
    },
  ],
  message: "Products fetched successfully",
};

const products = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
export default function Collection() {
  return (
    <>
      <div className="collection">
        <div className="mt-4 pr-[52px]">
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ProductCard({ product }) {
  const priceNum = Number(product?.price) || 0;
  const hasDiscount =
    product?.onSale &&
    typeof product?.discountPercentage === "number" &&
    product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? (priceNum * (1 - product.discountPercentage / 100)).toFixed(2)
    : priceNum.toFixed(2);

  const thumbs = (product?.images || [])
    .map((img) => (typeof img === "string" ? img : img?.imageUrl))
    .filter(Boolean);
  const fallbackThumbs = thumbs.length ? thumbs : [image, image, image];

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <div className="w-[120px] h-[120px] shrink-0 border border-gray-200 rounded-md overflow-hidden">
          <img
            src={fallbackThumbs[0]}
            alt="main"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold">
              {product?.name || "Untitled"}
            </h2>
            {product?.onSale && (
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                Sale{hasDiscount ? ` ${product.discountPercentage}%` : ""}
              </span>
            )}
            {product?.inStock ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                In stock
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                Out of stock
              </span>
            )}
            {product?.type && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded capitalize">
                {product.type}
              </span>
            )}
          </div>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-xl font-bold">${finalPrice}</span>
            {hasDiscount && (
              <span className="text-sm line-through text-gray-500">
                ${priceNum.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {fallbackThumbs.length > 0 && (
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {fallbackThumbs.map((src, idx) => (
            <div
              key={idx}
              className="w-[80px] h-[80px] border border-gray-200 rounded overflow-hidden bg-gray-50"
            >
              <img
                src={src}
                alt={`thumb-${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {Array.isArray(product?.variants) && product.variants.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-semibold mb-2">Variants</div>
          <div className="overflow-x-auto">
            <table className="min-w-[400px] w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">Color</th>
                  <th className="py-2 pr-2">Size</th>
                  <th className="py-2 pr-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr
                    key={v.id || `${v.color}-${v.size}`}
                    className="border-b last:border-b-0"
                  >
                    <td className="py-2 pr-2">{v.color}</td>
                    <td className="py-2 pr-2">{v.size}</td>
                    <td className="py-2 pr-2">{v.stockCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

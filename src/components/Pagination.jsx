const pageItems = (page, count) => {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index + 1);

  const wanted = new Set([1, count, page - 1, page, page + 1]);
  if (page <= 3) {
    wanted.add(2);
    wanted.add(3);
  }
  if (page >= count - 2) {
    wanted.add(count - 1);
    wanted.add(count - 2);
  }

  const numbers = [...wanted].filter((number) => number >= 1 && number <= count).sort((a, b) => a - b);
  const items = [];
  numbers.forEach((number, index) => {
    if (index > 0 && number - numbers[index - 1] > 1) items.push(index === 1 ? "left" : "right");
    items.push(number);
  });
  return items;
};

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <button
        type="button"
        className="px-3 py-1 font-[monospace] rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      {pageItems(page, totalPages).map((item) =>
        item === "left" || item === "right" ? (
          <span key={item} className="px-1 font-[monospace] text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`px-3 py-1 rounded ${
              page === item ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        className="px-3 py-1 font-[monospace] rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}

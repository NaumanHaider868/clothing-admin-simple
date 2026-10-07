export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-[monospace]">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-gray-600 mt-2 font-[monospace] max-w-2xl">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

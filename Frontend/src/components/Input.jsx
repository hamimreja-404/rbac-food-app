export default function Input({
  label,
  error,
  className = '',
  type = 'text',
  icon: Icon,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 font-body">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </span>
        )}
        <input
          type={type}
          className={[
            'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150',
            'focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
            error ? 'border-red-400' : 'border-gray-200',
            Icon ? 'pl-9' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-body">{error}</p>}
    </div>
  );
}

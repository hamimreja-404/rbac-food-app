export default function EmptyState({ emoji = '📭', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-6xl">{emoji}</span>
      <div>
        <h3 className="font-display font-semibold text-gray-700 text-lg">{title}</h3>
        {subtitle && (
          <p className="text-sm font-body text-gray-400 mt-1 max-w-xs">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

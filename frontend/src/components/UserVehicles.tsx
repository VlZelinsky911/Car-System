import type { Vehicle } from "../types";

export default function UserVehicles({ userId, items }: { userId: number; items?: Vehicle[] }) {
  if (!items) return (
    <div className="p-4 text-center">
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      <p className="mt-2 text-gray-600">Loading vehicles...</p>
    </div>
  );
  if (items.length === 0) return (
    <div className="p-4 text-gray-500 text-center">(no vehicles)</div>
  );
  return (
    <div className="bg-gradient-to-br from-slate-100 to-indigo-100 rounded-xl m-3 p-5 shadow-lg shadow-indigo-200/50 transition-shadow duration-200">
      <h3 className="font-bold text-lg mb-3 text-gray-800">Vehicles of user #{userId}</h3>
      <ul className="space-y-2">
        {items.map(v => (
          <li key={v.id} className="bg-white/70 rounded-lg p-3 shadow-sm">
            <span className="font-medium text-indigo-700">#{v.id}</span> {v.make} {v.model} {v.year ?? ""} {v.placeholder ? "(placeholder)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
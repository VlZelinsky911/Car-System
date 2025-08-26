import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../api/client";
import type { Vehicle, User } from "../types";
import { vehicleResolver, type VehicleFormData } from "../schemas";
import FormError from "../components/FormError";
import ButtonForm from "../components/ButtonForm";
import { useToast } from "../components/Toast";

export default function VehiclesPage() {
  const toast = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<VehicleFormData>({
    mode: "onChange",
    resolver: vehicleResolver,
    shouldFocusError: true,
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [vs, us] = await Promise.all([api.listVehicles(), api.listUsers()]);
      setVehicles(vs);
      setUsers(us);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (data: VehicleFormData) => {
    try {
      setCreating(true);
      const payload = {
        make: data.make.trim(),
        model: data.model.trim(),
        userId: Number(data.userId),
        year: data.year ? Number(data.year) : undefined,
      };
      const created = await api.createVehicle(payload);
      setVehicles((prev) => [...prev, created]);
      reset();
      toast.success("Vehicle created");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create vehicle");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete vehicle?")) return;
    try {
      await api.deleteVehicle(id);
      setVehicles((prev) => prev.filter(v => v.id !== id));
      toast.success("Vehicle deleted");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete vehicle");
    }
  };

  useEffect(() => { void loadAll(); }, []);

  return (
    <div className="max-w-4xl mx-auto my-6 px-3">
      <h1 className="text-4xl font-bold mb-7 tracking-wide">Vehicles</h1>

      <form onSubmit={handleSubmit(submit)} className="form-container grid-cols-1 md:grid-cols-5">
        <div>
          <input 
            {...register("make")}
            placeholder="Make" 
            className="input-field w-full"
          />
          <FormError error={errors.make?.message} />
        </div>
        <div>
          <input 
            {...register("model")}
            placeholder="Model" 
            className="input-field w-full"
          />
          <FormError error={errors.model?.message} />
        </div>
        <div>
          <input 
            {...register("year")}
            placeholder="Year (optional)" 
            className="input-field w-full"
          />
          <FormError error={errors.year?.message} />
        </div>
        <div>
          <select 
            {...register("userId")}
            className="input-field w-full"
          >
            <option value="">Select user...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.id} — {u.email}</option>)}
          </select>
          <FormError error={errors.userId?.message} />
        </div>

				<ButtonForm creating={creating} onClick={handleSubmit(submit)} />
      </form>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
								<th className="table-cell">ID</th>                
                <th className="table-cell">Make</th>
                <th className="table-cell">Model</th>
                <th className="table-cell">Year</th>
                <th className="table-cell">User</th>
                <th className="table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} className="table-row">
                  <td className="table-cell">{v.id}</td>
                  <td className="table-cell">{v.make}</td>
                  <td className="table-cell">{v.model}</td>
                  <td className="table-cell">{v.year ?? "—"}</td>
                  <td className="table-cell">{v.userId}</td>
                  <td className="table-cell">
                    <button 
                      onClick={() => void remove(v.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

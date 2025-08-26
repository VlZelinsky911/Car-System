import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../api/client";
import type { User, Vehicle } from "../types";
import { type UserFormData, userResolver } from "../schemas";
import FormError from "../components/FormError";
import ButtonForm from "../components/ButtonForm";
import UserVehicles from "../components/UserVehicles";
import { useToast } from "../components/Toast";


export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [vehiclesByUser, setVehiclesByUser] = useState<Record<number, Vehicle[]>>({});
  const [creating, setCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isSubmitted }
  } = useForm<UserFormData>({
    mode: "onChange",
    resolver: userResolver,
    shouldFocusError: true
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setUsers(await api.listUsers());
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleVehicles = async (userId: number) => {
    const now = { ...expanded, [userId]: !expanded[userId] };
    setExpanded(now);
    if (now[userId] && !vehiclesByUser[userId]) {
      const items = await api.listVehicles(userId);
      setVehiclesByUser((m) => ({ ...m, [userId]: items }));
    }
  };

  const submitCreate = async (data: UserFormData) => {
    try {
      setCreating(true);
      await api.createUser({
        email: data.email.trim().toLowerCase(),
        name: data.name.trim(),
        password: data.password,
      });
      reset();
      await loadUsers();
      toast.success("User created");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create user"); 
			console.error(e); 
    } finally {
      setCreating(false);
    }
  };

  const removeUser = async (id: number) => {
    if (!confirm("Delete user?")) return;
    try {
      await api.deleteUser(id);
      setUsers((list) => list.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete user"); 
    }
  };

  useEffect(() => { void loadUsers(); }, []);

  const onSubmitHandler = handleSubmit(submitCreate, () => {});

  return (
    <div className="max-w-4xl mx-auto my-6 px-3">
      <h1 className="text-4xl font-bold mb-7 tracking-wide">Users</h1>

      <form onSubmit={onSubmitHandler} className="form-container grid-cols-1 md:grid-cols-5">
        <div>
          <input 
            {...register("email")}
            placeholder="Email" 
            className="input-field w-full"
          />
          {errors.email?.message && <FormError error={errors.email.message} />}
        </div>
        <div>
          <input 
            {...register("name")}
            placeholder="Name" 
            className="input-field w-full"
          />
          {errors.name?.message && <FormError error={errors.name.message} />}
        </div>
        <div className="md:col-span-2">
          <input 
            {...register("password")}
            placeholder="Password (min 8)" 
            type="password" 
            className="input-field w-full"
          />
          {errors.password?.message && <FormError error={errors.password.message} />}
        </div>
				<ButtonForm creating={creating} onClick={onSubmitHandler} />		
      </form>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th className="table-cell">ID</th>
                <th className="table-cell">Email</th>
                <th className="table-cell">Name</th>
                <th className="table-cell">Vehicles</th>
                <th className="table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="table-cell">{u.id}</td>
                  <td className="table-cell">{u.email}</td>
                  <td className="table-cell">{u.name ?? "—"}</td>
                  <td className="table-cell">
                    <button 
                      onClick={() => void toggleVehicles(u.id)}
                      className="btn-primary text-sm px-4 py-1.5"
                    >
                      {expanded[u.id] ? "Hide" : "Show"}
                    </button>
                  </td>
                  <td className="table-cell">
                    <button 
                      onClick={() => void removeUser(u.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.map((u) =>
                expanded[u.id] ? (
                  <tr key={`veh-${u.id}`}>
                    <td colSpan={5} className="p-0">
                      <UserVehicles userId={u.id} items={vehiclesByUser[u.id]} />
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



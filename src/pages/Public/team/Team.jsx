import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../../../utlis/customAPI";
import { apiError } from "../../../utlis/common";
import { PageHeader } from "../../../components/PageHeader";
import { TextField } from "../../../components/TextField";
import { SimpleTable } from "../../../components/SimpleTable";
import { RoleGate } from "../../../components/RoleGate";
import { canManageTeam, ROLE_LABEL } from "../../../utlis/roles";
import { useAuth } from "../../../context/AuthContext";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  role: "EDITOR",
};

function Team() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/user", payload);
      return response.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (err) => toast.error(apiError(err, "Could not add this user")),
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const response = await api.patch(`/user/${id}/role`, { role });
      return response.data;
    },
    onSuccess: (result) => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (err) => toast.error(apiError(err, "Could not change the role")),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    createMutation.mutate(form);
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (row) => `${row.firstName || ""} ${row.lastName || ""}`.trim() || "-",
    },
    { key: "email", header: "Email", cell: (row) => row.email },
    { key: "phone", header: "Phone", cell: (row) => row.phone || "-" },
    {
      key: "role",
      header: "Role",
      cell: (row) =>
        row.id === user?.id ? (
          ROLE_LABEL[row.role]
        ) : (
          <select
            value={row.role}
            className="bg-transparent border-b border-black py-1"
            onChange={(event) => roleMutation.mutate({ id: row.id, role: event.target.value })}
          >
            {Object.entries(ROLE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ),
    },
  ];

  return (
    <RoleGate allow={canManageTeam}>
      <div className="pr-[52px] pt-6">
        <PageHeader
          title="Team"
          subtitle="Admin can do everything, including earnings. A manager can add, edit, and delete products. An editor can add and edit, but cannot delete. Every deletion is stored with the person who did it."
        />
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 max-w-3xl mb-10">
          <TextField
            label="First name"
            value={form.firstName}
            required
            onChange={(event) => setForm({ ...form, firstName: event.target.value })}
          />
          <TextField
            label="Last name"
            value={form.lastName}
            required
            onChange={(event) => setForm({ ...form, lastName: event.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            required
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            required
            minLength={8}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
          <label className="block">
            <span className="block font-medium font-[monospace] mb-1">Role</span>
            <select
              value={form.role}
              className="w-full py-3 pl-4 bg-transparent border-b border-black"
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="EDITOR">Editor</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-3 bg-black text-white rounded disabled:opacity-50"
            >
              Add team member
            </button>
          </div>
        </form>
        {isLoading ? <p className="font-[monospace]">Loading team...</p> : null}
        {isError ? <p className="text-red-600 font-[monospace]">{apiError(error)}</p> : null}
        {data ? <SimpleTable columns={columns} rows={data} empty="No users yet." /> : null}
      </div>
    </RoleGate>
  );
}

export { Team };

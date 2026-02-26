"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../lib/apiClient";

const statusOptions = ["Pending", "In Progress", "Completed"];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [error, setError] = useState("");

  const [formMode, setFormMode] = useState("create"); // "create" | "edit"
  const [editTaskId, setEditTaskId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);
    return params.toString();
  }, [page, limit, statusFilter, search]);

  const loadCurrentUser = async () => {
    try {
      const data = await apiFetch("/api/auth/me", {
        method: "GET",
      });
      setUser(data.user);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setTaskLoading(true);
      const data = await apiFetch(`/api/tasks?${queryParams}`, {
        method: "GET",
      });
      setTasks(data.tasks || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams, loading]);

  const resetForm = () => {
    setFormMode("create");
    setEditTaskId(null);
    setTitle("");
    setDescription("");
    setStatus("Pending");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (formMode === "create") {
        await apiFetch("/api/tasks", {
          method: "POST",
          body: JSON.stringify({ title, description, status }),
        });
      } else if (editTaskId) {
        await apiFetch(`/api/tasks/${editTaskId}`, {
          method: "PUT",
          body: JSON.stringify({ title, description, status }),
        });
      }
      resetForm();
      setPage(1);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (task) => {
    setFormMode("edit");
    setEditTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    setError("");
    try {
      await apiFetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore logout errors; just redirect
    } finally {
      router.replace("/login");
    }
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Dashboard</h2>
          {user && (
            <p className="dashboard-meta">
              Signed in as <strong>{user.name}</strong> ({user.email})
            </p>
          )}
        </div>
        <button onClick={handleLogout} className="btn btn-ghost">
          Logout
        </button>
      </div>

      {error && <div className="error-alert">{error}</div>}

      <section className="card">
        <div className="card-header">
          <h3 className="card-title">
            {formMode === "create" ? "Create Task" : "Edit Task"}
          </h3>
          <p className="card-subtitle">
            Keep titles concise and descriptions meaningful.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ flex: 2 }}>
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-base"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-base"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: "0.75rem" }}>
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="input-base textarea-input"
            />
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {formMode === "create" ? "Create Task" : "Save Changes"}
            </button>
            {formMode === "edit" && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-header">
          <h3 className="card-title">Tasks</h3>
          <p className="card-subtitle">
            Filter, search, and manage your personal task list.
          </p>
        </div>

        <div className="filters-row">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="input-base filters-row-search"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setPage(1);
              setStatusFilter(e.target.value);
            }}
            className="input-base filters-row-status"
          >
            <option value="">All statuses</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {taskLoading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>No tasks found.</p>
        ) : (
          <div className="tasks-table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const statusClass =
                    task.status === "Completed"
                      ? "status-badge status-badge--completed"
                      : task.status === "In Progress"
                      ? "status-badge status-badge--in-progress"
                      : "status-badge status-badge--pending";

                  return (
                    <tr key={task.id}>
                      <td>
                        <div className="tasks-title">{task.title}</div>
                      </td>
                      <td>
                        <div className="tasks-description">
                          {task.description}
                        </div>
                      </td>
                      <td>
                        <span className={statusClass}>{task.status}</span>
                      </td>
                      <td>
                        <div className="tasks-meta">
                          {new Date(task.createdAt).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                      </td>
                      <td>
                        <div className="tasks-actions">
                          <button
                            type="button"
                            onClick={() => handleEdit(task)}
                            className="btn btn-ghost"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(task.id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn btn-ghost"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn btn-ghost"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}


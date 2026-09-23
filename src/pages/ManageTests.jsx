import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTests, deleteTest } from "../firebase";
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Clock,
  Award,
  AlertTriangle,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function ManageTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const loadTests = async () => {
    try {
      setLoading(true);
      const data = await getTests();
      setTests(data || []);
    } catch (err) {
      console.error("Failed to load tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTests();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteTest(id);
      setTests((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirmId(null);
      setToastMsg("Test deleted successfully.");
      setTimeout(() => setToastMsg(""), 3500);
    } catch (err) {
      alert("Failed to delete test: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTests = tests.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.title?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Online Tests
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create new examinations, modify question structures, or remove obsolete tests.
          </p>
        </div>

        <Link
          to="/admin/tests/add"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Test</span>
        </Link>
      </div>

      {toastMsg && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search test by title or subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          {filteredTests.length} tests found
        </span>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading tests list...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-700">No tests match your criteria</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Get started by creating your first subject test.
            </p>
            <Link
              to="/admin/tests/add"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Test</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-4">Title & Subject</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Questions</th>
                  <th className="px-5 py-4">Pass %</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-sm text-slate-900 line-clamp-1">
                        {test.title}
                      </div>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
                        {test.subject || "General"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {test.duration} mins
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {test.questions?.length || 0}
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-600">
                      {test.passingPercentage}%
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      {test.createdAt
                        ? new Date(test.createdAt).toLocaleDateString()
                        : "Preset"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Preview as student */}
                        <Link
                          to={`/test/${test.id}`}
                          title="Preview Test as Student"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit */}
                        <Link
                          to={`/admin/tests/edit/${test.id}`}
                          title="Edit Test"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(test.id)}
                          title="Delete Test"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Delete Test?</h3>
            <p className="text-xs text-slate-500 mb-6">
              This action cannot be undone. All questions associated with this test will be removed.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
                className="py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-1.5"
              >
                {deletingId === deleteConfirmId ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

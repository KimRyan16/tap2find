<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">Manage Student Concerns</h1>
      <div class="flex items-center gap-3">
        <input
          v-model="query"
          type="text"
          placeholder="Search by student, professor, or message..."
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
        <select
          v-model="statusFilter"
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="archived">Archived</option>
        </select>
        <button class="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700" @click="exportCSV">
          ⬇️ Export CSV
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-3 border-b border-gray-200 text-sm text-gray-500 flex items-center justify-between">
        <div>Showing {{ filteredConcerns.length }} of {{ concerns.length }} concerns</div>
        <div v-if="loading" class="text-gray-400">Loading...</div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor Concerned</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concern Message</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="c in filteredConcerns" :key="c._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ displayStudent(c) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ displayProfessor(c) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-md">
                <div class="truncate" :title="c.message || c.concern || ''">{{ c.message || c.concern || '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
                      :class="badgeClass(c.status)">
                  {{ (c.status || 'pending') | capitalize }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(c.createdAt || c.timestamp || c.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                <button class="px-3 py-1.5 rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100" @click="archiveConcern(c)">
                  🗂️ Archive
                </button>
                <button class="px-3 py-1.5 rounded-md text-red-700 bg-red-50 hover:bg-red-100" @click="confirmDelete(c)">
                  🗑️ Delete
                </button>
              </td>
            </tr>
            <tr v-if="filteredConcerns.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500">No concerns found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Delete Concern</h3>
        </div>
        <div class="px-6 py-4 text-sm text-gray-700">
          Are you sure you want to delete this concern? This action cannot be undone.
        </div>
        <div class="px-6 py-4 flex items-center justify-end gap-3">
          <button class="px-4 py-2 rounded border" @click="deleteTarget = null">Cancel</button>
          <button class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" @click="performDelete">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/plugin/axios.js";

export default {
  name: "ManageStudentConcerns",
  data() {
    return {
      concerns: [],
      loading: false,
      query: "",
      statusFilter: "",
      deleteTarget: null,
    };
  },
  filters: {
    capitalize(v) {
      if (!v) return "";
      const s = String(v);
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
  },
  computed: {
    filteredConcerns() {
      const q = this.query.trim().toLowerCase();
      let list = this.concerns.filter((c) => {
        const student = this.displayStudent(c).toLowerCase();
        const prof = this.displayProfessor(c).toLowerCase();
        const msg = (c.message || c.concern || "").toLowerCase();
        const matchesText = student.includes(q) || prof.includes(q) || msg.includes(q);
        const status = (c.status || "").toLowerCase();
        const matchesStatus = this.statusFilter ? status === this.statusFilter : true;
        return matchesText && matchesStatus;
      });
      return list;
    },
  },
  mounted() {
    this.fetchConcerns();
  },
  methods: {
    async fetchConcerns() {
      try {
        this.loading = true;
        const res = await api.get("/admin/concerns");
        this.concerns = res.data.concerns || [];
      } catch (e) {
        console.error("Failed to fetch concerns", e);
      } finally {
        this.loading = false;
      }
    },
    displayStudent(c) {
      // Try common fields; fallback to names nested under user if present
      return (
        (c.studentName) ||
        (c.student && ((c.student.firstName || "") + " " + (c.student.lastName || ""))) ||
        ((c.firstName || "") + " " + (c.lastName || "")) ||
        "-"
      ).trim();
    },
    displayProfessor(c) {
      return (
        c.professorName ||
        (c.professor && ((c.professor.firstName || "") + " " + (c.professor.lastName || ""))) ||
        c.professor ||
        c.faculty ||
        "-"
      ).toString().trim();
    },
    formatDate(d) {
      if (!d) return "-";
      const date = new Date(d);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString();
    },
    badgeClass(status) {
      const s = (status || "pending").toLowerCase();
      if (s === "resolved") return "bg-green-100 text-green-800";
      if (s === "archived") return "bg-gray-100 text-gray-800";
      return "bg-yellow-100 text-yellow-800"; // pending
    },
    confirmDelete(c) {
      this.deleteTarget = c;
    },
    async performDelete() {
      try {
        if (!this.deleteTarget) return;
        await api.delete(`/admin/concerns/${this.deleteTarget._id}`);
        this.deleteTarget = null;
        await this.fetchConcerns();
      } catch (e) {
        console.error("Failed to delete concern", e);
        alert("Failed to delete concern");
      }
    },
    async archiveConcern(c) {
      try {
        await api.patch(`/admin/concerns/${c._id}`);
        await this.fetchConcerns();
      } catch (e) {
        console.error("Failed to archive concern", e);
        alert("Failed to archive concern");
      }
    },
    exportCSV() {
      const headers = [
        "Student Name",
        "Professor Concerned",
        "Concern Message",
        "Status",
        "Date Submitted",
      ];
      const rows = this.filteredConcerns.map((c) => [
        this.displayStudent(c),
        this.displayProfessor(c),
        (c.message || c.concern || "").replace(/\n/g, " ").replace(/\r/g, " "),
        (c.status || "pending"),
        this.formatDate(c.createdAt || c.timestamp || c.date),
      ]);
      const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `student_concerns_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

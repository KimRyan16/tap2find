export const professorDashboardPage = (req, res) => {
  // Authentication check removed for frontend development
  res.render("professor/dashboard", { title: "Professor Dashboard" });
};

export const studentHomePage = (req, res) => {
  // Authentication check removed for frontend development
  res.render("student/home", { title: "Student Home" });
};

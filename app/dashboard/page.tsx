import React from "react";
import Dashboard from "./Dashboard";
import DashboardNavbar from "./DashboardNavbar";

export default function Page() {
  return (
    <div className="mx-12">
      <DashboardNavbar />
      <Dashboard />
    </div>
  );
}

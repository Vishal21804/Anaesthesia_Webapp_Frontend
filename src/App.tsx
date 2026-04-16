import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginScreen from "./pages/LoginScreen";
import { HMDashboard } from "./pages/HMDashboard";
import { TechnicianDashboard } from "./pages/TechnicianDashboard";
import { BMETDashboard } from "./pages/BMETDashboard";

// BMET Pages
import { BMETIssueInbox } from "./pages/BMETIssueInbox";
import { BMETIssueManagement } from "./pages/BMETIssueManagement";
import { BMETUpdateRepairStatus } from "./pages/BMETUpdateRepairStatus";
import { BMETMaintenanceHistory } from "./pages/BMETMaintenanceHistory";
import { BMETInspectionDetails } from "./pages/BMETInspectionDetails";
import { BMETIssueDetail } from "./pages/BMETIssueDetail";

// Technician Pages
import { ProblemReport } from "./pages/ProblemReport";
import { MachineDetail } from "./pages/MachineDetail";
import { OTSelection } from "./pages/OTSelection";
import { ReportConfirmation } from "./pages/ReportConfirmation";
import { ATOTDetails } from "./pages/ATOTDetails";
import { ChecklistMachines } from "./pages/ChecklistMachines";
import { MachineList } from "./pages/MachineList";
import { MachineInspectionDetail } from "./pages/MachineInspectionDetail";
import { History } from "./pages/History";

// HM Pages
import { HMMachineManagement } from "./pages/HMMachineManagement";
import { HMOTManagement } from "./pages/HMOTManagement";
import { HMUserAccessManagement } from "./pages/HMUserAccessManagement";

import { HMTechnicianAssignment } from "./pages/HMTechnicianAssignment";
import { HMReportHistory } from "./pages/HMReportHistory";
import { HMInspectionDetails } from "./pages/HMInspectionDetails";
import { HMDownloadReport } from "./pages/HMDownloadReport";
import { HMDownloadReportDate } from "./pages/HMDownloadReportDate";
import { HMHospitalSettings } from "./pages/HMHospitalSettings";
import { HMAddMachine } from "./pages/HMAddMachine";
import HMAddOTRoom from "./pages/HMAddOTRoom";
import { HMMachineDetail } from "./pages/HMMachineDetail";
import { HMAssignMachineToOTNew } from "./pages/HMAssignMachineToOTNew";
import { HMEditMachine } from "./pages/HMEditMachine";
import { HMEditOT } from "./pages/HMEditOT";
import { AssignOT } from "./pages/AssignOT";
import { HMUserAccessControl } from "./pages/HMUserAccessControl";
import HMTechnicianOTAssign from "./pages/HMTechnicianOTAssign";
import { HMProfile } from "./pages/HMProfile";
import { HMCreateUser } from "./pages/HMCreateUser";
import { EditProfile } from "./pages/EditProfile";

import { ProfileScreen } from "./pages/ProfileScreen";
import { LogoutConfirmationScreen } from "./pages/LogoutConfirmationScreen";

import { RegisterScreen } from "./pages/RegisterScreen";
import { ForgotPasswordScreen } from "./pages/ForgotPasswordScreen";
import FirstLoginOnboarding from "./pages/FirstLoginOnboarding";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route
          path="/first-login-onboarding"
          element={
            <ProtectedRoute>
              <FirstLoginOnboarding />
            </ProtectedRoute>
          }
        />

        {/* HM Routes */}
        <Route
          path="/hm-dashboard"
          element={
            <ProtectedRoute>
              <HMDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/management/machines"
          element={
            <ProtectedRoute>
              <HMMachineManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/ot"
          element={
            <ProtectedRoute>
              <HMOTManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/user-access"
          element={
            <ProtectedRoute>
              <HMUserAccessManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/user-access/:userId"
          element={
            <ProtectedRoute>
              <HMUserAccessControl />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/technician-assignment"
          element={
            <ProtectedRoute>
              <HMTechnicianAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/technician-ot-assign/:id"
          element={
            <ProtectedRoute>
              <HMTechnicianOTAssign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/report-history"
          element={
            <ProtectedRoute>
              <HMReportHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspection-details/:inspectionId"
          element={
            <ProtectedRoute>
              <HMInspectionDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/download-report"
          element={
            <ProtectedRoute>
              <HMDownloadReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/download-report-date"
          element={
            <ProtectedRoute>
              <HMDownloadReportDate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/hospital-settings"
          element={
            <ProtectedRoute>
              <HMHospitalSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/create-user"
          element={
            <ProtectedRoute>
              <HMCreateUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/profile"
          element={
            <ProtectedRoute>
              <HMProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/add-machine"
          element={
            <ProtectedRoute>
              <HMAddMachine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/add-ot"
          element={
            <ProtectedRoute>
              <HMAddOTRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hm/machine/:id"
          element={
            <ProtectedRoute>
              <HMMachineDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/ot-assign-machine/:otId"
          element={
            <ProtectedRoute>
              <HMAssignMachineToOTNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hm-edit-machine/:id"
          element={
            <ProtectedRoute>
              <HMEditMachine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/edit-ot/:id"
          element={
            <ProtectedRoute>
              <HMEditOT />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/assign-ot"
          element={
            <ProtectedRoute>
              <AssignOT />
            </ProtectedRoute>
          }
        />
        {/* Technician Routes */}
        <Route
          path="/technician-dashboard"
          element={
            <ProtectedRoute>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/report/:machineId"
          element={
            <ProtectedRoute>
              <ProblemReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/checklist/:otId"
          element={
            <ProtectedRoute>
              <ChecklistMachines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/machines/:otId"
          element={
            <ProtectedRoute>
              <MachineList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/inspect/:otId/:machineId"
          element={
            <ProtectedRoute>
              <MachineDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/inspection/:machineId"
          element={
            <ProtectedRoute>
              <MachineInspectionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/ot-selection"
          element={
            <ProtectedRoute>
              <OTSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician/history/:otId"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        <Route
          path="/technician/confirmation"
          element={
            <ProtectedRoute>
              <ReportConfirmation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/at/checklist"
          element={
            <ProtectedRoute>
              <ATOTDetails />
            </ProtectedRoute>
          }
        />

        {/* BMET Routes */}
        <Route
          path="/bmet-dashboard"
          element={
            <ProtectedRoute>
              <BMETDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmet/inbox"
          element={
            <ProtectedRoute>
              <BMETIssueInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmet/issues"
          element={
            <ProtectedRoute>
              <BMETIssueManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmet/repair-status/:id"
          element={
            <ProtectedRoute>
              <BMETUpdateRepairStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmet/history"
          element={
            <ProtectedRoute>
              <BMETMaintenanceHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmet/issue/:id"
          element={
            <ProtectedRoute>
              <BMETIssueDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bmet/inspection/:id"
          element={
            <ProtectedRoute>
              <BMETInspectionDetails />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/technician/profile"
          element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout-confirm"
          element={
            <ProtectedRoute>
              <LogoutConfirmationScreen />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { CandidateLayout } from "./candidate/CandidateLayout";
import { JobsIndexPage } from "./candidate/JobsIndexPage";
import { JobPage } from "./candidate/JobPage";
import { ApplyPage } from "./candidate/ApplyPage";
import { StatusPage } from "./candidate/StatusPage";
import { LifePage } from "./candidate/LifePage";
import { BenefitsPage } from "./candidate/BenefitsPage";
import { AiNoticePage } from "./candidate/AiNoticePage";
import { RecruiterLayout } from "./recruit/RecruiterLayout";
import { TodayPage } from "./recruit/TodayPage";
import { PipelinePage } from "./recruit/PipelinePage";
import { CandidatePage } from "./recruit/CandidatePage";
import { CandidatesPage } from "./recruit/CandidatesPage";
import { JobSetupPage } from "./recruit/JobSetupPage";
import { AiLogPage } from "./recruit/AiLogPage";
import { AiActivityPage } from "./recruit/AiActivityPage";
import { SettingsPage } from "./recruit/SettingsPage";

/**
 * Each navigation starts the new page at the top; without this the router
 * keeps the old page's scroll position. Anchors still win, and back and
 * forward keep the browser's own restored position.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType === "POP") return;
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    try {
      window.scrollTo(0, 0);
    } catch {
      // not implemented in some test environments
    }
  }, [pathname, hash, navigationType]);
  return null;
}

/** The route table, separate from the router so tests can mount it in a MemoryRouter. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<CandidateLayout />}>
        <Route path="/" element={<JobsIndexPage />} />
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route path="/life" element={<LifePage />} />
        <Route path="/benefits" element={<BenefitsPage />} />
        <Route path="/how-ai-works" element={<AiNoticePage />} />
      </Route>
      {/* The apply flow and the status page carry their own headers. */}
      <Route path="/jobs/:jobId/apply" element={<ApplyPage />} />
      <Route path="/status/:token" element={<StatusPage />} />
      <Route path="/recruit" element={<RecruiterLayout />}>
        <Route index element={<TodayPage />} />
        <Route path="jobs/new" element={<JobSetupPage />} />
        <Route path="jobs/:jobId" element={<PipelinePage />} />
        <Route path="jobs/:jobId/ai-log" element={<AiLogPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
        <Route path="candidates/:id" element={<CandidatePage />} />
        <Route path="ai-activity" element={<AiActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

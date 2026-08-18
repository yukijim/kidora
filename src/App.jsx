import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { ChildLayout, ParentLayout, LandingLayout } from './components/layout/AppShell/AppShell';

/* ---- Child Pages ---- */
import HomePage from './pages/child/HomePage/HomePage';
import LearnPage from './pages/child/LearnPage/LearnPage';
import PlayPage from './pages/child/PlayPage/PlayPage';
import GrowPage from './pages/child/GrowPage/GrowPage';
import AchievePage from './pages/child/AchievePage/AchievePage';
import MissionPage from './pages/child/MissionPage/MissionPage';
import ProfilePage from './pages/child/ProfilePage/ProfilePage';

/* ---- Parent Pages ---- */
import DashboardPage from './pages/parent/DashboardPage/DashboardPage';
import ProgressPage from './pages/parent/ProgressPage/ProgressPage';
import AchievementsPage from './pages/parent/AchievementsPage/AchievementsPage';
import ActivityPage from './pages/parent/ActivityPage/ActivityPage';
import SettingsPage from './pages/parent/SettingsPage/SettingsPage';

/* ---- Landing Page ---- */
import LandingPage from './pages/landing/LandingPage/LandingPage';

/* ---- Styles ---- */
import './styles/reset.css';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/animations.css';
import './App.css';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <LearningProvider>
          <BrowserRouter>
            <Routes>
              {/* Landing / Public */}
              <Route element={<LandingLayout />}>
                <Route path="/" element={<LandingPage />} />
              </Route>

              {/* Child Experience */}
              <Route path="/child" element={<ChildLayout />}>
                <Route index element={<HomePage />} />
                <Route path="learn" element={<LearnPage />} />
                <Route path="play" element={<PlayPage />} />
                <Route path="grow" element={<GrowPage />} />
                <Route path="achieve" element={<AchievePage />} />
                <Route path="mission/:id" element={<MissionPage />} />
                <Route path="mission" element={<MissionPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Parent Dashboard (Protected by PIN Gateway in ParentLayout) */}
              <Route path="/parent" element={<ParentLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LearningProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

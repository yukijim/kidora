import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessProvider } from './context/AccessContext.jsx';
import Landing from './pages/Landing/Landing.jsx';
import GameHub from './pages/Games/GameHub.jsx';
import ThankYou from './pages/ThankYou/ThankYou.jsx';
import AbcGame from './pages/games/AbcGame.jsx';
import CountingGame from './pages/games/CountingGame.jsx';
import MatchingGame from './pages/games/MatchingGame.jsx';

import './styles/reset.css';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/animations.css';
import './App.css';

export default function App() {
  return (
    <AccessProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/terima-kasih/:orderId" element={<ThankYou />} />
          <Route path="/main" element={<GameHub />} />
          <Route path="/main/abc" element={<AbcGame />} />
          <Route path="/main/kira" element={<CountingGame />} />
          <Route path="/main/padan" element={<MatchingGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AccessProvider>
  );
}

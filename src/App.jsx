import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessProvider } from './context/AccessContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import Landing from './pages/landing/Landing.jsx';
import GameHub from './pages/Games/GameHub.jsx';
import ThankYou from './pages/ThankYou/ThankYou.jsx';
import AbcGame from './pages/Games/AbcGame.jsx';
import CountingGame from './pages/Games/CountingGame.jsx';
import MatchingGame from './pages/Games/MatchingGame.jsx';
import LetterChoice from './pages/Games/LetterChoice.jsx';
import LetterMatch from './pages/Games/LetterMatch.jsx';
import LetterFind from './pages/Games/LetterFind.jsx';
import LetterOrder from './pages/Games/LetterOrder.jsx';
import LetterSpell from './pages/Games/LetterSpell.jsx';
import LetterModule from './pages/Games/LetterModule.jsx';

import './styles/reset.css';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/animations.css';
import './App.css';

export default function App() {
  return (
    <LanguageProvider>
      <AccessProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/terima-kasih/:orderId" element={<ThankYou />} />
            <Route path="/main" element={<GameHub />} />
            <Route path="/main/abc" element={<AbcGame />} />
            <Route path="/main/bunyi" element={<LetterChoice mode="bunyi" />} />
            <Route path="/main/awal" element={<LetterChoice mode="awal" />} />
            <Route path="/main/vokal" element={<LetterChoice mode="vokal" />} />
            <Route path="/main/kuiz" element={<LetterChoice mode="kuiz" />} />
            <Route path="/main/suku" element={<LetterChoice mode="suku" />} />
            <Route path="/main/ulang1" element={<LetterChoice mode="kuiz" gameId="ulang1" range={[0, 12]} />} />
            <Route path="/main/ulang2" element={<LetterChoice mode="kuiz" gameId="ulang2" range={[13, 25]} />} />
            <Route path="/main/besarkecil" element={<LetterMatch mode="besarkecil" />} />
            <Route path="/main/ingatan" element={<LetterMatch mode="ingatan" />} />
            <Route path="/main/cari" element={<LetterFind />} />
            <Route path="/main/susun" element={<LetterOrder />} />
            <Route path="/main/eja" element={<LetterSpell />} />
            <Route path="/main/huruf/:letter" element={<LetterModule />} />
            <Route path="/main/kira" element={<CountingGame />} />
            <Route path="/main/padan" element={<MatchingGame />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AccessProvider>
    </LanguageProvider>
  );
}

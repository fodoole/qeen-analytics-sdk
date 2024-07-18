/* global fodoole */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './Home';
import About from './About';
import Contact from './Contact';

function AnalyticsWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    // fodoole.fetchFodooleContent();

    fodoole.initPageSession({
      analyticsEndpoint: '/log',
      projectId: '123',
      contentServingId: '0',
      contentId: '-',
      isPdp: true,
      idleTime: 10_000
    });

    fodoole.bindClickEvents([new fodoole.InteractionEvent('CLICK_P', 'p')]);
    fodoole.bindScrollEvents([new fodoole.InteractionEvent('SCROLL_P', 'p')]);
  }, [location]);

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnalyticsWrapper>
    </BrowserRouter>
  );
}

export default App;
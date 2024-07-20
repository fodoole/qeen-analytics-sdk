/* global fodoole */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './Home';
import Product from './Product';
import Checkout from './Checkout';
import About from './About';
import Nav from './Nav';

function AnalyticsWrapper({ children }) {
  const location = useLocation();
  const isPdp = location.pathname.includes('/product/');

  useEffect(() => {
    // fodoole.fetchFodooleContent();
  
    fodoole.initPageSession({
      fodooleDeviceId: 'dev',
      analyticsEndpoint: '/log',
      projectId: '123',
      contentServingId: isPdp ? String(fodoole.randInt()) : '0',
      contentId: isPdp ? 'optimised' : '-',
      isPdp: isPdp,
      idleTime: 5_000
    });

    fodoole.bindClickEvents(new fodoole.InteractionEvent('CLICK_LINK', '.nav'));
  }, [location]);

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsWrapper>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </AnalyticsWrapper>
    </BrowserRouter>
  );
}

export default App;
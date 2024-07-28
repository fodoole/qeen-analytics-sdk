/* global qeen */
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './Home';
import Product from './Product';
import Checkout from './Checkout';
import About from './About';
import Nav from './Nav';

import '../styles/App.css';

function AnalyticsWrapper({ children }) {
  const location = useLocation();
  const isPdp = location.pathname.includes('/product/');

  useEffect(() => {
    // qeen.fetchQeenContent();

    qeen.setContentServed();

    qeen.initPageSession({
      qeenDeviceId: 'dev',
      analyticsEndpoint: '/log',
      projectId: '123',
      contentServingId: isPdp ? String(qeen.randInt()) : '0',
      contentId: isPdp ? 'optimised' : '-',
      isPdp: isPdp,
      idleTime: 60_000,
    });

    qeen.bindClickEvents(new qeen.InteractionEvent('CLICK_LINK', '.nav'));
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
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import About from './components/About';
import Contact from './components/Contact';
import LandingPage from './components/LandingPage';
import './styles/App.css'

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Header />
          <main className="content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={
                <>
                  <SignedIn>
                    <HomePage />
                  </SignedIn>
                  <SignedOut>
                    <LandingPage />
                  </SignedOut>
                </>
              } />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;

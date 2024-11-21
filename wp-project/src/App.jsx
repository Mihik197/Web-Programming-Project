// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CalendarPage from './pages/CalendarPage';
import DayPage from './pages/DayPage';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import AlbumsPage from './pages/AlbumsPage';
import AlbumViewPage from './pages/AlbumViewPage'; // Import the new page
import GalleryPage from './pages/GalleryPage'; // Import the new page

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CalendarPage />} />
            <Route path="day/:date" element={<DayPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="albums/:albumId" element={<AlbumViewPage />} /> {/* New Route */}
            <Route path="gallery" element={<GalleryPage />} /> {/* New Route */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

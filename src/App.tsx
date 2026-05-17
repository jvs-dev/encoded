import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import WebData from './pages/WebData';
import Dashboard from './pages/Dashboard';
import Prospect from './pages/Prospect';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';
import BriefingPage from './pages/BriefingPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/webdata" element={<WebData />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prospect" element={<Prospect />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/briefing/:type" element={<BriefingPage />} />
      </Routes>
    </Router>
  );
}

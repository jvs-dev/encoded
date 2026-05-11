import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import WebData from './pages/WebData';
import Dashboard from './pages/Dashboard';
import Prospect from './pages/Prospect';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPostPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/webdata" element={<WebData />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prospect" element={<Prospect />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </Router>
  );
}

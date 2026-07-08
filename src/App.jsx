import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EntityList from './pages/EntityList';
import EntityCreate from './pages/EntityCreate';
import EntityDetail from './pages/EntityDetail';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:entity" element={<EntityList />} />
        <Route path="/:entity/new" element={<EntityCreate />} />
        <Route path="/:entity/:id" element={<EntityDetail />} />
      </Route>
    </Routes>
  );
}

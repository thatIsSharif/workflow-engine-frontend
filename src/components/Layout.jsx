import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api, setUserId, getUserId } from '../api';
import ThemeToggle from './ThemeToggle';

const ENTITIES = [
  { key: 'noc', label: 'NOC' },
  { key: 'loa', label: 'LOA' },
  { key: 'finance', label: 'Finance' },
  { key: 'rental', label: 'Rental' },
  { key: 'cancellation', label: 'Cancellation' },
];

export default function Layout() {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(getUserId());
  const navigate = useNavigate();

  useEffect(() => {
    api.listUsers().then(setUsers).catch(() => {});
  }, []);

  const handleUserChange = (e) => {
    const id = e.target.value;
    setCurrentUserId(id);
    setUserId(id);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h1 className="sidebar-title" onClick={() => navigate('/')}>
          ⚙ Workflow Engine
        </h1>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            📊 Dashboard
          </NavLink>
          {ENTITIES.map((e) => (
            <NavLink
              key={e.key}
              to={`/${e.key}`}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
            >
              {e.label}
            </NavLink>
          ))}
        </nav>
        <div className="user-switcher">
          <label>User:</label>
          <select value={currentUserId} onChange={handleUserChange}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
        <div className="theme-switcher">
          <ThemeToggle />
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const ENTITY_LABELS = {
  NOC: 'NOC', LOA: 'LOA', FINANCE: 'Finance', RENTAL: 'Rental', CANCELLATION: 'Cancellation',
};
const ENTITY_ROUTES = {
  NOC: 'noc', LOA: 'loa', FINANCE: 'finance', RENTAL: 'rental', CANCELLATION: 'cancellation',
};

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getDashboardSummary(),
      api.getRecentActivity(20),
    ])
      .then(([s, a]) => { setSummary(s); setActivity(a); })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">Failed to load dashboard: {error.message}</div>;

  const grouped = {};
  if (summary) {
    for (const item of summary.by_entity) {
      if (!grouped[item.entity]) grouped[item.entity] = {};
      grouped[item.entity][item.status] = item.count;
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <section className="dashboard-section">
        <h2>Applications by Status</h2>
        <div className="summary-grid">
          {Object.entries(grouped).map(([entity, statuses]) => (
            <div key={entity} className="summary-card">
              <h3>
                <Link to={`/${ENTITY_ROUTES[entity] || entity.toLowerCase()}`}>
                  {ENTITY_LABELS[entity] || entity}
                </Link>
              </h3>
              <table className="summary-table">
                <tbody>
                  {Object.entries(statuses).map(([status, count]) => (
                    <tr key={status}>
                      <td className={`status-badge status-${status.toLowerCase()}`}>{status}</td>
                      <td className="count">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Object.keys(statuses).length === 0 && <p className="empty">No applications</p>}
            </div>
          ))}
          {Object.keys(grouped).length === 0 && <p className="empty">No applications found</p>}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent Activity</h2>
        {activity.length === 0 ? (
          <p className="empty">No recent activity</p>
        ) : (
          <div className="activity-feed">
            {activity.map((entry) => (
              <div key={entry.id} className="activity-item">
                <span className="activity-entity">{entry.entity}</span>
                <Link to={`/${ENTITY_ROUTES[entry.entity] || entry.entity.toLowerCase()}/${entry.entity_id}`} className="activity-link">
                  {entry.entity_id.substring(0, 8)}...
                </Link>
                <span className={`status-badge status-${entry.new_state.toLowerCase()}`}>{entry.new_state}</span>
                <span className="activity-action">{entry.action}</span>
                {entry.comment && <span className="activity-comment">— "{entry.comment}"</span>}
                <span className="activity-time">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { useToast } from '../components/Toast';

export default function EntityDetail() {
  const { entity, id } = useParams();
  const toast = useToast();

  const [app, setApp] = useState(null);
  const [actions, setActions] = useState([]);
  const [history, setHistory] = useState([]);
  const [comment, setComment] = useState('');
  const [acting, setActing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get(entity, id),
      api.getActions(entity, id),
      api.getHistory(entity, id),
    ])
      .then(([a, acts, hist]) => {
        setApp(a);
        setActions(acts);
        setHistory(hist);
      })
      .catch((err) => toast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [entity, id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAction = async (action) => {
    setActing(action);
    try {
      await api.doAction(entity, id, action, comment || null);
      toast(`Action "${action}" executed successfully!`);
      setComment('');
      fetchAll();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setActing(null);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!app) return <div className="error">Application not found</div>;

  const fields = Object.entries(app).filter(
    ([k]) => !['version', 'created_by'].includes(k)
  );

  return (
    <div>
      <div className="page-header">
        <h1>{entity.toUpperCase()} Application</h1>
        <Link to={`/${entity}`} className="btn">← Back to List</Link>
      </div>

      {/* Status Badge */}
      <div className="status-section">
        <span className={`status-badge status-${app.status?.toLowerCase()} status-large`}>
          {app.status}
        </span>
        {app.id && <code className="entity-id">ID: {app.id}</code>}
      </div>

      {/* Available Actions */}
      <section className="card">
        <h2>Workflow Actions</h2>
        {actions.length === 0 ? (
          <p className="empty">No actions available in terminal state</p>
        ) : (
          <div className="actions-bar">
            {actions.map((action) => (
              <button
                key={action}
                className={`btn btn-action btn-${action.toLowerCase()}`}
                onClick={() => handleAction(action)}
                disabled={acting !== null}
              >
                {acting === action ? '...' : action}
              </button>
            ))}
          </div>
        )}
        <div className="action-comment">
          <textarea
            placeholder="Optional comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
          />
        </div>
      </section>

      {/* Application Details */}
      <section className="card">
        <h2>Details</h2>
        <table className="detail-table">
          <tbody>
            {fields.map(([key, value]) => (
              <tr key={key}>
                <th>{key.replace(/_/g, ' ')}</th>
                <td>
                  {key === 'status' ? (
                    <span className={`status-badge status-${String(value).toLowerCase()}`}>{value}</span>
                  ) : key === 'id' ? (
                    <code>{value}</code>
                  ) : key.includes('amount') && value != null ? (
                    Number(value).toLocaleString()
                  ) : key.includes('_at') || key.includes('_from') || key.includes('_to') ? (
                    value ? new Date(value).toLocaleString() : ''
                  ) : (
                    String(value ?? '')
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Audit Trail */}
      <section className="card">
        <h2>History / Audit Trail</h2>
        {history.length === 0 ? (
          <p className="empty">No history entries</p>
        ) : (
          <div className="history-timeline">
            {history.map((entry) => (
              <div key={entry.id} className="history-item">
                <div className="history-header">
                  <span className="history-action">{entry.action}</span>
                  <span className={`status-badge status-${entry.old_state?.toLowerCase()}`}>{entry.old_state}</span>
                  <span className="history-arrow">→</span>
                  <span className={`status-badge status-${entry.new_state?.toLowerCase()}`}>{entry.new_state}</span>
                </div>
                <div className="history-meta">
                  {entry.actioned_by && <span>By User #{entry.actioned_by}</span>}
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                </div>
                {entry.comment && <div className="history-comment">"{entry.comment}"</div>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

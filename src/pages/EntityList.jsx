import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

const ENTITY_TITLES = {
  noc: 'NOC Applications', loa: 'LOA Applications', finance: 'Finance Requests',
  rental: 'Rental Contracts', cancellation: 'Cancellation Requests',
};

const PAGE_SIZE = 20;

export default function EntityList() {
  const { entity } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const skip = (page - 1) * PAGE_SIZE;

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.list(entity, skip, PAGE_SIZE)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [entity, skip]);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const goToPage = (p) => {
    setSearchParams({ page: String(p) });
  };

  const columns = data?.items?.[0] ? Object.keys(data.items[0]).filter(
    (k) => !['version', 'created_by'].includes(k)
  ) : [];

  return (
    <div>
      <div className="page-header">
        <h1>{ENTITY_TITLES[entity] || entity}</h1>
        <div className="tabs">
          <Link to={`/${entity}`} className="tab active">All Applications</Link>
          <Link to={`/${entity}/new`} className="tab">Create New</Link>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Failed to load: {error.message}</div>}

      {data && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col.replace(/_/g, ' ')}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="empty">No applications found</td></tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((col) => (
                      <td key={col}>
                        {col === 'id' ? (
                          <Link to={`/${entity}/${item.id}`}>{String(item[col]).substring(0, 8)}...</Link>
                        ) : col === 'status' ? (
                          <span className={`status-badge status-${String(item[col]).toLowerCase()}`}>{item[col]}</span>
                        ) : col.includes('amount') && item[col] != null ? (
                          Number(item[col]).toLocaleString()
                        ) : col.includes('_at') || col.includes('_from') || col.includes('_to') ? (
                          item[col] ? new Date(item[col]).toLocaleDateString() : ''
                        ) : (
                          String(item[col] ?? '')
                        )}
                      </td>
                    ))}
                    <td>
                      <Link to={`/${entity}/${item.id}`} className="btn btn-sm">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>Prev</button>
              <span>Page {page} of {totalPages} ({data.total} total)</span>
              <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

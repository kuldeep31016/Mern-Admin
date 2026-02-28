import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalLists: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch agents and lists in parallel
      const [agentsResponse, listsResponse] = await Promise.all([
        api.get('/agents'),
        api.get('/lists')
      ]);

      const agents = agentsResponse.data.agents || [];
      const lists = listsResponse.data.lists || [];

      // Calculate total contacts from all lists
      const totalContacts = lists.reduce((sum, list) => {
        return sum + (list.items?.length || 0);
      }, 0);

      setStats({
        totalAgents: agents.length,
        totalLists: lists.length,
        totalContacts
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="stats-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <StatCard
          title="Total Agents"
          value={stats.totalAgents}
          color="#1a237e"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />

        <StatCard
          title="Total Lists"
          value={stats.totalLists}
          color="#2e7d32"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          }
        />

        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          color="#e53935"
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 2.1l4 4-4 4" />
              <path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4" />
              <path d="M21 11.8v2a4 4 0 0 1-4 4H4.2" />
            </svg>
          }
        />
      </div>

      <div className="welcome-section">
        <h2>Welcome to Admin Panel</h2>
        <p>Manage your agents and distribute contact lists efficiently.</p>
        <div className="quick-links">
          <a href="/agents" className="quick-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Manage Agents</span>
          </a>
          <a href="/lists" className="quick-link">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>Upload Lists</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

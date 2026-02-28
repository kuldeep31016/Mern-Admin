import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import AgentModal from '../components/AgentModal';
import './Agents.css';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agents');
      setAgents(response.data.agents || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to fetch agents');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId, agentName) => {
    if (window.confirm(`Are you sure you want to delete ${agentName}?`)) {
      try {
        const response = await api.delete(`/agents/${agentId}`);
        if (response.data.success) {
          toast.success(response.data.message || 'Agent deleted successfully');
          fetchAgents();
        }
      } catch (error) {
        const message =
          error.response?.data?.message || 'Failed to delete agent';
        toast.error(message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="agents-container">
      <div className="agents-header">
        <h2 className="agents-title">Agents</h2>
        <button
          className="add-agent-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Agent
        </button>
      </div>

      <div className="agents-table-wrapper">
        {loading ? (
          <div className="loading-state">Loading agents...</div>
        ) : agents.length === 0 ? (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <h3>No agents found</h3>
            <p>Get started by adding your first agent</p>
            <button
              className="empty-action-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Add Agent
            </button>
          </div>
        ) : (
          <table className="agents-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile Number</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <tr key={agent._id}>
                  <td>{index + 1}</td>
                  <td className="agent-name">{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{agent.mobileNumber}</td>
                  <td>{formatDate(agent.createdAt)}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAgent(agent._id, agent.name)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAgents}
      />
    </div>
  );
};

export default Agents;

import './StatCard.css';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-card-content">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;

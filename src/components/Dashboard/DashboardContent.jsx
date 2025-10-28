import React from "react";
import {
  FaBoxes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaSearch,
  FaEnvelope,
  FaBell,
  FaPlus,
  FaDownload,
  FaStethoscope,
  FaSyringe,
  FaHeartbeat,
  FaClock,
  FaMapMarkerAlt,
  FaWrench,
  FaUser,
  FaCalendar,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardContent.css";

const DashboardContent = () => {
  const { user } = useAuth();

  // Função para gerar iniciais do nome do usuário
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Função para gerar email baseado no nome do usuário
  const getUserEmail = (user) => {
    // Prioriza o email real do banco de dados
    if (user?.email) {
      return user.email;
    }
    // Fallback para email gerado se não houver email no banco
    if (user?.username) {
      return `${user.username}@hospital.com`;
    }
    if (user?.nome) {
      const emailName = user.nome.toLowerCase().replace(/\s+/g, ".");
      return `${emailName}@hospital.com`;
    }
    return "usuario@hospital.com";
  };

  const statsCards = [
    {
      title: "Total de Equipamentos",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: FaBoxes,
      featured: true,
    },
    {
      title: "Equipamentos em Manutenção",
      value: "23",
      change: "-5%",
      trend: "down",
      icon: FaExclamationTriangle,
      featured: false,
    },
    {
      title: "Equipamentos Ativos",
      value: "1,224",
      change: "+8%",
      trend: "up",
      icon: FaCheckCircle,
      featured: false,
    },
    {
      title: "Usuários Ativos",
      value: "156",
      change: "+3%",
      trend: "up",
      icon: FaUsers,
      featured: false,
    },
  ];

  const chartData = [
    { day: "Seg", height: 68, active: true, usage: "85%", equipment: "Raio-X" },
    {
      day: "Ter",
      height: 48,
      active: false,
      usage: "60%",
      equipment: "Monitor",
    },
    {
      day: "Qua",
      height: 76,
      active: true,
      usage: "95%",
      equipment: "Ultrassom",
    },
    {
      day: "Qui",
      height: 62,
      active: true,
      usage: "78%",
      equipment: "Desfibrilador",
    },
    { day: "Sex", height: 52, active: false, usage: "65%", equipment: "Bomba" },
    {
      day: "Sáb",
      height: 36,
      active: false,
      usage: "45%",
      equipment: "Monitor",
    },
    {
      day: "Dom",
      height: 28,
      active: false,
      usage: "35%",
      equipment: "Raio-X",
    },
  ];

  const maintenanceAlerts = [
    {
      id: 1,
      title: "Manutenção Preventiva - Raio-X",
      time: "14:00 - 16:00",
      priority: "high",
      equipment: "Raio-X Digital",
      technician: "Dr. Alexandra Silva",
      status: "agendada",
    },
    {
      id: 2,
      title: "Calibração de Monitores",
      time: "09:00 - 11:00",
      priority: "medium",
      equipment: "Monitor Cardíaco",
      technician: "Téc. João Santos",
      status: "em_andamento",
    },
  ];

  const equipmentList = [
    {
      name: "Monitor Cardíaco Philips",
      date: "Nov 26, 2024",
      icon: FaHeartbeat,
      status: "ativo",
      location: "UTI 1",
      lastMaintenance: "15 dias atrás",
    },
    {
      name: "Bomba de Infusão",
      date: "Dez 01, 2024",
      icon: FaSyringe,
      status: "manutencao",
      location: "Enfermaria 3",
      lastMaintenance: "2 dias atrás",
    },
    {
      name: "Raio-X Digital",
      date: "Dez 05, 2024",
      icon: FaStethoscope,
      status: "ativo",
      location: "Radiologia",
      lastMaintenance: "7 dias atrás",
    },
    {
      name: "Desfibrilador",
      date: "Dez 10, 2024",
      icon: FaHeartbeat,
      status: "ativo",
      location: "Pronto Socorro",
      lastMaintenance: "10 dias atrás",
    },
    {
      name: "Ultrassom Portátil",
      date: "Dez 15, 2024",
      icon: FaStethoscope,
      status: "ativo",
      location: "Ambulatório",
      lastMaintenance: "5 dias atrás",
    },
  ];

  const maintenanceTeam = [
    {
      name: "Dr. Alexandra Silva",
      task: "Manutenção Preventiva - Raio-X",
      status: "completed",
      avatar: "DAS",
      specialization: "Equipamentos de Imagem",
      workload: "85%",
    },
    {
      name: "Téc. João Santos",
      task: "Calibração Monitores",
      status: "in-progress",
      avatar: "TJS",
      specialization: "Equipamentos Cardíacos",
      workload: "60%",
    },
    {
      name: "Eng. Maria Costa",
      task: "Inspeção Equipamentos",
      status: "pending",
      avatar: "EMC",
      specialization: "Equipamentos Gerais",
      workload: "45%",
    },
    {
      name: "Téc. Pedro Lima",
      task: "Atualização Software",
      status: "completed",
      avatar: "TPL",
      specialization: "Sistemas Digitais",
      workload: "70%",
    },
  ];
  const equipmentBySector = [
    { sector: "UTI", count: 245, percentage: 35, color: "#3b82f6" },
    { sector: "Radiologia", count: 156, percentage: 22, color: "#10b981" },
    { sector: "Enfermaria", count: 312, percentage: 28, color: "#f59e0b" },
    { sector: "Pronto Socorro", count: 89, percentage: 15, color: "#ef4444" },
  ];

  const upcomingMaintenances = [
    {
      equipment: "Raio-X Digital",
      sector: "Radiologia",
      date: "Hoje",
      time: "14:00",
      priority: "high",
    },
    {
      equipment: "Monitor Cardíaco",
      sector: "UTI 1",
      date: "Amanhã",
      time: "09:00",
      priority: "medium",
    },
    {
      equipment: "Bomba de Infusão",
      sector: "Enfermaria 3",
      date: "Dez 03",
      time: "11:00",
      priority: "medium",
    },
    {
      equipment: "Desfibrilador",
      sector: "Pronto Socorro",
      date: "Dez 05",
      time: "16:00",
      priority: "low",
    },
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div className="dashboard-header-top">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Pesquisar equipamento"
            />
            <span className="search-shortcut">⌘F</span>
          </div>
          <div className="user-section">
            <div className="notification-icons">
              <div className="notification-icon">
                <FaEnvelope />
              </div>
              <div className="notification-icon">
                <FaBell />
              </div>
            </div>
            <div className="user-avatar">{getUserInitials(user?.nome)}</div>
            <div className="user-info">
              <p className="user-name">{user?.nome || "Usuário"}</p>
              <p className="user-email">{getUserEmail(user)}</p>
            </div>
          </div>
        </div>
        <div className="dashboard-header-bottom">
          <div className="dashboard-title-section">
            <h1>Dashboard</h1>
            <p className="dashboard-subtitle">
              Gerencie, monitore e mantenha seus equipamentos hospitalares com
              eficiência.
            </p>
          </div>
          <div className="action-buttons">
            <button className="btn-primary">
              <FaPlus /> Adicionar Equipamento
            </button>
            <button className="btn-secondary">
              <FaDownload /> Relatório de Manutenção
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="stats-grid">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`stat-card ${card.featured ? "featured" : ""}`}
            >
              <div className="stat-card-header">
                <h3 className="stat-title">{card.title}</h3>
                <card.icon className="stat-icon" />
              </div>
              <div className="stat-value">{card.value}</div>
              <div className={`stat-change ${card.trend}`}>
                {card.trend === "up" ? <FaArrowUp /> : <FaArrowDown />}
                <span>{card.change} em relação ao mês passado</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-main">
          {/* Analytics Chart */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Uso de Equipamentos</h2>
              <div className="chart-summary">
                <span className="summary-label">Média Semanal:</span>
                <span className="summary-value">66%</span>
              </div>
            </div>
            <div className="section-content">
              <div className="analytics-chart">
                {chartData.map((bar, index) => (
                  <div key={index} className="chart-container">
                    <div
                      className={`chart-bar ${bar.active ? "active" : ""}`}
                      style={{ height: `${bar.height}px` }}
                    >
                      <span className="chart-percentage">{bar.usage}</span>
                      <div className="chart-tooltip">
                        <div className="tooltip-equipment">{bar.equipment}</div>
                      </div>
                    </div>
                    <span className="chart-bar-label">{bar.day}</span>
                  </div>
                ))}
              </div>
              <div className="chart-footer">
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-dot active"></div>
                    <span>Alto Uso (&gt;70%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot inactive"></div>
                    <span>Uso Normal (&lt;70%)</span>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="stat-item">
                    <span className="stat-label">Pico:</span>
                    <span className="stat-value">95%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Baixo:</span>
                    <span className="stat-value">35%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance Alerts */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Alertas de Manutenção</h2>
              <div className="alert-count">
                <span className="count-badge">{maintenanceAlerts.length}</span>
              </div>
            </div>
            <div className="section-content">
              <div className="alert-card">
                <div className="alert-main">
                  <div className="alert-icon">
                    <FaWrench />
                  </div>
                  <div className="alert-info">
                    <h3 className="alert-title">
                      {maintenanceAlerts[0]?.title}
                    </h3>
                    <div className="alert-meta">
                      <span className="alert-time">
                        <FaClock />
                        {maintenanceAlerts[0]?.time}
                      </span>
                      <span className="alert-equipment">
                        <FaStethoscope />
                        {maintenanceAlerts[0]?.equipment}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="alert-footer">
                  <div className="alert-technician">
                    <FaUser />
                    <span>{maintenanceAlerts[0]?.technician}</span>
                  </div>
                  <button
                    className={`alert-btn ${maintenanceAlerts[0]?.status}`}
                  >
                    {maintenanceAlerts[0]?.status === "agendada"
                      ? "Iniciar"
                      : "Continuar"}
                  </button>
                </div>
              </div>
              {maintenanceAlerts.length > 1 && (
                <div className="alert-summary">
                  <span className="summary-text">
                    +{maintenanceAlerts.length - 1} outros alertas pendentes
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Equipment List */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Equipamentos</h2>
              <button className="section-btn">+ Novo</button>
            </div>
            <div className="section-content">
              <div className="equipment-list">
                {equipmentList.slice(0, 4).map((equipment, index) => (
                  <div
                    key={index}
                    className={`equipment-item ${equipment.status}`}
                  >
                    <div className="equipment-icon">
                      <equipment.icon />
                    </div>
                    <div className="equipment-info">
                      <h3 className="equipment-name">{equipment.name}</h3>
                      <div className="equipment-details">
                        <div className="equipment-location">
                          <FaMapMarkerAlt />
                          <span>{equipment.location}</span>
                        </div>
                        <div className="equipment-date">
                          <FaCalendar />
                          <span>Próxima: {equipment.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="equipment-status">
                      <span className={`status-badge ${equipment.status}`}>
                        {equipment.status === "ativo" ? "Ativo" : "Manutenção"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {equipmentList.length > 4 && (
                <div className="equipment-summary">
                  <span className="summary-text">
                    +{equipmentList.length - 4} outros equipamentos
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Maintenance Team */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Equipe de Manutenção</h2>
              <button className="section-btn">+ Adicionar Técnico</button>
            </div>
            <div className="section-content">
              <div className="team-list">
                {maintenanceTeam.map((member, index) => (
                  <div key={index} className="team-member">
                    <div className="member-avatar">{member.avatar}</div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-specialization">
                        {member.specialization}
                      </p>
                      <p className="member-task">{member.task}</p>
                      <div className="member-workload">
                        <div className="workload-bar">
                          <div
                            className="workload-fill"
                            style={{ width: member.workload }}
                          ></div>
                        </div>
                        <span className="workload-text">{member.workload}</span>
                      </div>
                    </div>
                    <div className="member-status">
                      <span className={`status-badge ${member.status}`}>
                        {member.status === "completed" && "Concluído"}
                        {member.status === "in-progress" && "Em Progresso"}
                        {member.status === "pending" && "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Equipment by Sector */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Equipamentos por Setor</h2>
            </div>
            <div className="section-content">
              <div className="sector-chart">
                {equipmentBySector.map((item, index) => (
                  <div key={index} className="sector-item">
                    <div className="sector-header">
                      <div className="sector-info">
                        <div
                          className="sector-color"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <div>
                          <p className="sector-name">{item.sector}</p>
                          <p className="sector-count">
                            {item.count} equipamentos
                          </p>
                        </div>
                      </div>
                      <span className="sector-percentage">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="sector-bar">
                      <div
                        className="sector-bar-fill"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Maintenances */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Próximas Manutenções</h2>
              <button className="section-btn">Ver Todas</button>
            </div>
            <div className="section-content">
              <div className="maintenance-schedule">
                {upcomingMaintenances.map((maintenance, index) => (
                  <div
                    key={index}
                    className={`maintenance-schedule-item ${maintenance.priority}`}
                  >
                    <div className="schedule-time">
                      <p className="schedule-date">{maintenance.date}</p>
                      <p className="schedule-hour">{maintenance.time}</p>
                    </div>
                    <div className="schedule-info">
                      <p className="schedule-equipment">
                        {maintenance.equipment}
                      </p>
                      <p className="schedule-sector">{maintenance.sector}</p>
                    </div>
                    <div
                      className={`schedule-priority ${maintenance.priority}`}
                    >
                      <span
                        className="priority-dot"
                        style={{
                          backgroundColor:
                            maintenance.priority === "high"
                              ? "#ef4444"
                              : maintenance.priority === "medium"
                              ? "#f59e0b"
                              : "#10b981",
                        }}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

import React, { useState } from 'react';

export default function EquipmentManagement({ equipmentData, setEquipmentData }) {
  const [open, setOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    Equipment_ID: '',
    Name: '',
    Project_ID: '',
    Status: 'Idle',
    Last_Inspection: '',
    Next_Maintenance: '',
    GPS_Location: '',
    Operator: '',
    Fuel_Consumption_L_per_hr: ''
  });

  const [newMaintenance, setNewMaintenance] = useState({
    date: '',
    performedBy: '',
    issueResolved: '',
    costIncurred: '',
    status: 'Pending'
  });

  const getMaintenanceStatus = (nextDate) => {
    const today = new Date();
    const maintenance = new Date(nextDate);
    const diffDays = Math.ceil((maintenance - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'upcoming';
    return 'normal';
  };

  const handleAddEquipment = () => {
    const equipId = `EQP-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedEquipment = {
      ...newEquipment,
      Equipment_ID: equipId,
    };
    setEquipmentData([...equipmentData, updatedEquipment]);
    setOpen(false);
    setNewEquipment({
      Equipment_ID: '',
      Name: '',
      Project_ID: '',
      Status: 'Idle',
      Last_Inspection: '',
      Next_Maintenance: '',
      GPS_Location: '',
      Operator: '',
      Fuel_Consumption_L_per_hr: ''
    });
  };

  const handleMaintenanceAdd = () => {
    if (selectedEquipment) {
      const updatedHistory = [...maintenanceHistory, {
        ...newMaintenance,
        equipmentId: selectedEquipment.Equipment_ID,
        id: Date.now()
      }];
      setMaintenanceHistory(updatedHistory);
      setMaintenanceOpen(false);
      setNewMaintenance({
        date: '',
        performedBy: '',
        issueResolved: '',
        costIncurred: '',
        status: 'Pending'
      });
    }
  };

  return (
    <div className="equipment-management">
      <div className="management-header">
        <h2>Equipment Management</h2>
        <button className="btn primary" onClick={() => setOpen(true)}>
          Add New Equipment
        </button>
      </div>

      <table className="equipment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Next Maintenance</th>
            <th>Operator</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {equipmentData && equipmentData.map((equipment) => (
            <tr 
              key={equipment.Equipment_ID}
              className={`maintenance-${getMaintenanceStatus(equipment.Next_Maintenance)}`}
            >
              <td>{equipment.Equipment_ID}</td>
              <td>{equipment.Name}</td>
              <td>{equipment.Status}</td>
              <td>{equipment.Next_Maintenance}</td>
              <td>{equipment.Operator}</td>
              <td>
                <button
                  className="btn outline"
                  onClick={() => {
                    setSelectedEquipment(equipment);
                    setMaintenanceOpen(true);
                  }}
                >
                  Maintenance Log
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Equipment</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={newEquipment.Name}
                onChange={(e) => setNewEquipment({...newEquipment, Name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Project ID</label>
              <input
                type="text"
                value={newEquipment.Project_ID}
                onChange={(e) => setNewEquipment({...newEquipment, Project_ID: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={newEquipment.Status}
                onChange={(e) => setNewEquipment({...newEquipment, Status: e.target.value})}
              >
                <option value="In Use">In Use</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Idle">Idle</option>
              </select>
            </div>
            <div className="form-group">
              <label>Next Maintenance</label>
              <input
                type="date"
                value={newEquipment.Next_Maintenance}
                onChange={(e) => setNewEquipment({...newEquipment, Next_Maintenance: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Operator</label>
              <input
                type="text"
                value={newEquipment.Operator}
                onChange={(e) => setNewEquipment({...newEquipment, Operator: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Fuel Consumption (L/hr)</label>
              <input
                type="number"
                value={newEquipment.Fuel_Consumption_L_per_hr}
                onChange={(e) => setNewEquipment({...newEquipment, Fuel_Consumption_L_per_hr: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn primary" onClick={handleAddEquipment}>Add Equipment</button>
            </div>
          </div>
        </div>
      )}
      {maintenanceOpen && selectedEquipment && (
        <div className="modal">
          <div className="modal-content">
            <h3>Log Maintenance for {selectedEquipment.Name}</h3>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={newMaintenance.date}
                onChange={(e) => setNewMaintenance({...newMaintenance, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Performed By</label>
              <input
                type="text"
                value={newMaintenance.performedBy}
                onChange={(e) => setNewMaintenance({...newMaintenance, performedBy: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Issue Resolved</label>
              <textarea
                value={newMaintenance.issueResolved}
                onChange={(e) => setNewMaintenance({...newMaintenance, issueResolved: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Cost Incurred</label>
              <input
                type="number"
                value={newMaintenance.costIncurred}
                onChange={(e) => setNewMaintenance({...newMaintenance, costIncurred: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={newMaintenance.status}
                onChange={(e) => setNewMaintenance({...newMaintenance, status: e.target.value})}
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn" onClick={() => setMaintenanceOpen(false)}>Cancel</button>
              <button className="btn primary" onClick={handleMaintenanceAdd}>Log Maintenance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
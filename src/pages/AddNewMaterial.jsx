import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import "../assets/styles/addnewmaterial.css";
// import { useNavigate } from "react-router-dom";
import SubModuleBar from "../components/SubModuleBar";
const moduleBarData = [
  { url: "/materials", text: "Overview" },
  { url: "/stock-level", text: "Stock Level" },
  { url: "/add-new-stock", text: "Add New Stock/Supplier" },
  { url: "/daily-usage", text: "Daily Material Usage" },
  { url: "/stock-history", text: "Stock History" },
  { url: "/cost-analysis", text: "Cost Analysis" },
];

const AddNewMaterial = () => {
  const [stock, setStock] = useState([]);
  const [projectIds, setProjectIds] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [materials, setMaterials] = useState([
    { materialName: "", searchTerm: "", filteredMaterials: [] },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    fetch("/data/project_all_materials_updated.xlsx")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setStock(jsonData);

        const uniqueProjectIds = [
          ...new Set(jsonData.map((item) => item.Project_ID)),
        ];
        setProjectIds(uniqueProjectIds);
      })
      .catch((error) => console.error("Error loading Excel file:", error));
  }, []);

  const handleProjectChange = (e) => {
    const selectedId = e.target.value;
    setSelectedProjectId(selectedId);
    setSelectedSupplier("");
    setAvailableMaterials([]);

    if (selectedId) {
      const filteredSuppliers = [
        ...new Set(
          stock
            .filter((item) => item.Project_ID === selectedId)
            .map((item) => item.Supplier)
        ),
      ];
      setSuppliers(filteredSuppliers);
    } else {
      setSuppliers([]);
    }
  };

  const handleSupplierChange = (e) => {
    const supplier = e.target.value;
    setSelectedSupplier(supplier);

    if (supplier && suppliers.includes(supplier)) {
      const materialsForSupplier = stock.filter(
        (item) =>
          item.Project_ID === selectedProjectId && item.Supplier === supplier
      );
      setAvailableMaterials(
        materialsForSupplier.length
          ? materialsForSupplier.map((item) => item.Material)
          : []
      );
    } else {
      setAvailableMaterials([]);
    }
  };

  return (
    <div className="stock-container">
      <SubModuleBar moduleData={moduleBarData} />
      <h2 className="mate">Add New Material</h2>

      <div className="form-container">
        <div className="form-section">
          <select
            value={selectedProjectId}
            onChange={handleProjectChange}
            className="dropdown4"
          >
            <option value="">Select Project ID</option>
            {projectIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter or Select Supplier"
            value={selectedSupplier}
            onChange={handleSupplierChange}
            className="input-field"
            list="supplier-list"
          />
          <datalist id="supplier-list">
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier} />
            ))}
          </datalist>

          <h3 className="subtitle">Material Details</h3>
          {materials.map((material, index) => (
            <div key={index} className="material-row">
              <input
                type="text"
                placeholder="Search or Enter Material Name"
                value={material.searchTerm || material.materialName}
                onChange={(e) => {
                  const updatedMaterials = [...materials];
                  updatedMaterials[index].searchTerm = e.target.value;
                  updatedMaterials[index].materialName = e.target.value;

                  const existingMaterials = [
                    ...new Set(stock.map((item) => item.Material)),
                  ];
                  updatedMaterials[index].filteredMaterials =
                    existingMaterials.filter((mat) =>
                      mat.toLowerCase().includes(e.target.value.toLowerCase())
                    );

                  setMaterials(updatedMaterials);
                }}
                className="input-field"
              />
              {material.searchTerm && material.filteredMaterials.length > 0 && (
                <ul className="dropdown-list">
                  {material.filteredMaterials.slice(0, 5).map((mat, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        const updatedMaterials = [...materials];
                        updatedMaterials[index].materialName = mat;
                        updatedMaterials[index].searchTerm = "";
                        updatedMaterials[index].filteredMaterials = [];
                        setMaterials(updatedMaterials);
                      }}
                    >
                      {mat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button
            className="add-more-btn"
            onClick={() =>
              setMaterials([
                ...materials,
                { materialName: "", searchTerm: "", filteredMaterials: [] },
              ])
            }
          >
            Add More
          </button>
          <button
            className="submit-btn4"
            onClick={() => {
              console.log("Project ID:", selectedProjectId);
              console.log("Supplier:", selectedSupplier);
              console.log(
                "Materials:",
                materials.map((m) => m.materialName)
              );
              setShowPopup(true);
              setTimeout(() => setShowPopup(false), 3000);
            }}
          >
            Submit
          </button>
          {showPopup && (
            <div className="popup-message">✅ Material Added Successfully!</div>
          )}
        </div>

        <div className="card">
          <h3>Available Materials</h3>
          {availableMaterials.length > 0 ? (
            <ul>
              {availableMaterials.map((material, index) => (
                <li key={index}>{material}</li>
              ))}
            </ul>
          ) : (
            <p>No available materials for this supplier.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewMaterial;

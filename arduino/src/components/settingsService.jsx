 //settingsServices.jsx
 import React, { useEffect, useState } from 'react';
 import { fetchSettings, updateSetting, deleteSetting } from '../services/settingsServices';
 
 function SettingsPanel() {
   const [settings, setSettings] = useState([]);
   const [error, setError] = useState(null);
   const [editingId, setEditingId] = useState(null);
   const [editValues, setEditValues] = useState({});
 
   useEffect(() => {
     loadSettings();
   }, []);
 
   const loadSettings = async () => {
     try {
       const data = await fetchSettings();
       setSettings(data);
     } catch (err) {
       setError(err.message);
     }
   };
 
   const handleEdit = (setting) => {
     setEditingId(setting.id);
     setEditValues({
       key: setting.setting_key,
       value: setting.setting_value,
     });
   };
 
   const handleCancel = () => {
     setEditingId(null);
     setEditValues({});
   };
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setEditValues((prev) => ({
       ...prev,
       [name]: value,
     }));
   };
 
   const handleSave = async (id) => {
     try {
       await updateSetting(id, editValues.key, editValues.value);
       await loadSettings();
       setEditingId(null);
       setEditValues({});
       setError(null); // Clear any previous errors
     } catch (err) {
       setError(err.message);
     }
   };
 
   const handleDelete = async (id) => {
     if (!window.confirm('Are you sure you want to delete this setting?')) {
       return; // Cancel deletion if user clicks "Cancel" in the confirmation dialog
     }
 
     try {
       await deleteSetting(id);
       await loadSettings(); // Reload settings after deletion
       setError(null); // Clear any previous errors
     } catch (err) {
       setError(err.message);
     }
   };
 
   return (
     <div className="settings-panel">
       <h1>Device Settings</h1>
       {error && <div className="error-message">{error}</div>}
       
       <table className="settings-table">
         <thead>
           <tr>
             <th>Setting</th>
             <th>Value</th>
             <th>Actions</th>
           </tr>
         </thead>
         <tbody>
           {settings.map((setting) => (
             <tr key={setting.id}>
               <td>
                 {editingId === setting.id ? (
                   <input
                     type="text"
                     name="key"
                     value={editValues.key}
                     onChange={handleChange}
                   />
                 ) : (
                   setting.setting_key
                 )}
               </td>
               <td>
                 {editingId === setting.id ? (
                   <input
                     type="text"
                     name="value"
                     value={editValues.value}
                     onChange={handleChange}
                   />
                 ) : (
                   setting.setting_value
                 )}
               </td>
               <td>
                 {editingId === setting.id ? (
                   <>
                     <button onClick={() => handleSave(setting.id)}>Save</button>
                     <button onClick={handleCancel}>Cancel</button>
                   </>
                 ) : (
                   <>
                     <button onClick={() => handleEdit(setting)}>Edit</button>
                     <button className="delete-button" onClick={() => handleDelete(setting.id)}>
                       Delete
                     </button>
                   </>
                 )}
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
 }
 
 export default SettingsPanel;
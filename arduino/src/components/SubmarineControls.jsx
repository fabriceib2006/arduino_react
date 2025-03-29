 // components/SubmarineControls.jsx
 import React, { useState } from 'react';

 function SubmarineControls({ isConnected, updateStatus }) {
   const [controls, setControls] = useState({
     throttle: 0,
     rudder: 0,
     dive: 0
   });
 
   const sendCommand = (command) => {
     if (!isConnected) return;
     console.log('Sending command:', command);
     updateStatus(prev => ({
       ...prev,
       speed: controls.throttle,
       direction: controls.rudder,
       depth: controls.dive
     }));
   };
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setControls(prev => {
       const newControls = { ...prev, [name]: parseInt(value) };
       sendCommand(newControls);
       return newControls;
     });
   };
 
   return (
     <div className="controls-panel">
       <h2>Precision Controls</h2>
       <div className="control-group">
         <label>Throttle: {controls.throttle}%</label>
         <input
           type="range"
           name="throttle"
           min="-100" // Allow reverse
           max="100"
           value={controls.throttle}
           onChange={handleChange}
           disabled={!isConnected}
         />
       </div>
       <div className="control-group">
         <label>Rudder: {controls.rudder}°</label>
         <input
           type="range"
           name="rudder"
           min="-90"
           max="90"
           value={controls.rudder}
           onChange={handleChange}
           disabled={!isConnected}
         />
       </div>
       <div className="control-group">
         <label>Dive: {controls.dive}m</label>
         <input
           type="range"
           name="dive"
           min="0"
           max="100"
           value={controls.dive}
           onChange={handleChange}
           disabled={!isConnected}
         />
       </div>
     </div>
   );
 }
 
 export default SubmarineControls;
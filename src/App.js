import React, { useEffect, useRef } from 'react';
import carpet from './assets/carpet.png';
import chair from './assets/club_chair.glb';
const App = () => {
  const objectRef = useRef(null); // Reference for the draggable object
  useEffect(() => {
    let isDragging = false;
    let initialMousePosition = { x: 0, y: 0 };
    let initialObjectPosition = { x: 0, y: 0, z: 0 };
    const objectEl = objectRef.current; // Access the A-Frame entity via the ref
    // Function to initiate dragging (lifting the object)
    const onMouseDown = (e) => {
      isDragging = true;
      const { clientX, clientY } = e;
      initialMousePosition = { x: clientX, y: clientY };
      const position = objectEl.getAttribute('position');
      initialObjectPosition = { ...position };
      objectEl.object3D.position.y += 0.1; // Slightly lift the object
    };
    // Function to handle dragging (moving the object)
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - initialMousePosition.x) * 0.01; // Simplified movement calculation
      const dz = (e.clientY - initialMousePosition.y) * 0.01; // Moving in the XZ plane
      objectEl.object3D.position.x = initialObjectPosition.x + dx;
      objectEl.object3D.position.z = initialObjectPosition.z - dz;
    };
    // Function to end dragging (dropping the object)
    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      objectEl.object3D.position.y -= 0.1; // Lower the object back
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);
  return (
    <div>
      <a-scene arjs="debugUIEnabled: false;">
        {/* Grid floor */}
        <a-plane
          position="0 0 0"
          rotation="-90 0 0"
          width="10"
          height="10"
          color="#CCCCCC"
          material={`shader: flat; src: ${carpet}; repeat: 10 10`}
        ></a-plane>
        {/* Draggable object */}
        {/*Chair */}
        <a-entity
          gltf-model={chair}
          scale="0.02 0.02 0.02"
          position="0 0.1 -1"
          rotation="0 -35 0"
          ref={objectRef}
        ></a-entity>
        {/* Camera */}
        <a-entity camera></a-entity> {/* Camera entity for stabilization */}
        <a-camera position="0 0.5 2" look-controls-enabled="false"></a-camera>
      </a-scene>
    </div>
  );
};
export default App;

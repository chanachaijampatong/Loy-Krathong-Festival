import React, { useEffect, useRef } from 'react';
import { SceneManager } from '../scene/SceneManager';

export default function ThreeCanvas({ contestants, onSelectKrathong, sceneRef }) {
  const containerRef = useRef(null);
  const managerRef = useRef(null);
  const prevIdsRef = useRef('');

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new SceneManager(containerRef.current, onSelectKrathong);
    manager.loadKrathongs(contestants || []);
    managerRef.current = manager;
    prevIdsRef.current = (contestants || []).map(c => c.id).sort().join(',');

    if (sceneRef) {
      sceneRef.current = manager;
    }

    return () => {
      manager.destroy();
    };
  }, []);

  // When contestants list changes, update 3D krathongs smoothly without recreating scene!
  useEffect(() => {
    if (!managerRef.current || !contestants) return;
    const currentIds = contestants.map(c => c.id).sort().join(',');
    if (currentIds !== prevIdsRef.current) {
      prevIdsRef.current = currentIds;
      managerRef.current.loadKrathongs(contestants);
    }
  }, [contestants]);

  return (
    <div
      ref={containerRef}
      id="three-canvas-container"
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
    />
  );
}

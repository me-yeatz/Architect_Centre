import React, { useState, useRef } from 'react';
import { NodeData, Connection } from '../types';
import { Node } from './Node';

interface CanvasProps {
  nodes: NodeData[];
  edges: Connection[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
}

export const Canvas: React.FC<CanvasProps> = ({ nodes, edges, setNodes }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    
    setOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    
    const newX = e.clientX - offset.x;
    const newY = e.clientY - offset.y;

    setNodes(prev => prev.map(n => 
      n.id === draggingId ? { ...n, x: newX, y: newY } : n
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Draw Connections SVG
  const renderConnections = () => {
    return edges.map(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return null;

      // Calculate center points for connection
      // Node is w-44 (176px) roughly
      const startX = fromNode.x + 176; 
      const startY = fromNode.y + 40; 
      const endX = toNode.x;
      const endY = toNode.y + 40;

      const cp1X = startX + (endX - startX) / 2;
      const cp2X = endX - (endX - startX) / 2;

      return (
        <path
          key={edge.id}
          d={`M ${startX} ${startY} C ${cp1X} ${startY}, ${cp2X} ${endY}, ${endX} ${endY}`}
          stroke="#3A2C39" 
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="hover:stroke-misty-orchid transition-colors"
        />
      );
    });
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-canvas-bg"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={canvasRef}
    >
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#3A2C39 2px, transparent 2px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {renderConnections()}
      </svg>

      {nodes.map(node => (
        <Node key={node.id} data={node} onMouseDown={handleMouseDown} />
      ))}
    </div>
  );
};
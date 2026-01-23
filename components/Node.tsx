import React from 'react';
import { NodeData, NodeType } from '../types';
import { Activity, ShieldAlert, MessageSquare, Zap, CheckCircle2, Sparkles } from 'lucide-react';

interface NodeProps {
  data: NodeData;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
}

export const Node: React.FC<NodeProps> = ({ data, onMouseDown }) => {
  const getStyles = (type: NodeType) => {
    switch (type) {
      // Trigger: 
      case NodeType.TRIGGER: return 'bg-white shadow-[4px_4px_0px_#F2D9EE]';
      // Condition: 
      case NodeType.CONDITION: return 'bg-white shadow-[4px_4px_0px_#98869E]';
      // Action: 
      case NodeType.ACTION: return 'bg-white shadow-[4px_4px_0px_#3A2C39]';
      default: return 'bg-white shadow-[4px_4px_0px_gray]';
    }
  };

  const getTypeColor = (type: NodeType) => {
    switch (type) {
      case NodeType.TRIGGER: return 'bg-pale-purple text-dark-purple';
      case NodeType.CONDITION: return 'bg-misty-orchid text-white';
      case NodeType.ACTION: return 'bg-dark-purple text-white';
      case NodeType.RESPONSE: return 'bg-blue-400 text-white';
    }
  };

  const getIcon = (type: NodeType) => {
    switch (type) {
      case NodeType.TRIGGER: return <Zap className="w-3 h-3" />;
      case NodeType.CONDITION: return <ShieldAlert className="w-3 h-3" />;
      case NodeType.ACTION: return <Activity className="w-3 h-3" />;
      case NodeType.RESPONSE: return <MessageSquare className="w-3 h-3" />;
    }
  };

  const getStatusIndicator = () => {
    if (data.status === 'processing') return (
       <div className="absolute -top-3 -right-3 z-10 bg-white rounded-full border-2 border-dark-purple p-1 shadow-sm">
         <Sparkles className="w-4 h-4 text-misty-orchid animate-spin" />
       </div>
    );
    if (data.status === 'success') return <CheckCircle2 className="absolute -top-3 -right-3 z-10 w-6 h-6 text-green-500 bg-white rounded-full border-2 border-dark-purple" />;
    return null;
  };

  return (
    <div
      className={`absolute w-44 rounded-2xl p-0 select-none cursor-move transition-transform active:scale-95 border-[3px] border-dark-purple ${getStyles(data.type)}`}
      style={{ left: data.x, top: data.y }}
      onMouseDown={(e) => onMouseDown(e, data.id)}
    >
      {getStatusIndicator()}
      
      {/* Header Pill */}
      <div className="p-3 pb-2 flex justify-between items-start">
         <div className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-dark-purple flex items-center gap-1 ${getTypeColor(data.type)}`}>
            {getIcon(data.type)}
            {data.type}
         </div>
      </div>

      {/* Body */}
      <div className="px-3 pb-4">
        <div className="text-sm font-bold text-dark-purple leading-tight">{data.label}</div>
      </div>
      
      {/* Ports - Solid circles */}
      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white rounded-full border-[3px] border-dark-purple" />
      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-white rounded-full border-[3px] border-dark-purple" />
    </div>
  );
};
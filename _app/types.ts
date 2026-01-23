export enum NodeType {
  TRIGGER = 'TRIGGER',
  ACTION = 'ACTION',
  CONDITION = 'CONDITION',
  RESPONSE = 'RESPONSE',
}

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  config?: Record<string, any>;
  status?: 'idle' | 'processing' | 'success' | 'error';
  output?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'client';
  text: string;
  timestamp: Date;
  metadata?: {
    isScopeCreep?: boolean;
    confidence?: number;
    reasoning?: string;
  };
}

export interface AutomationLog {
  id: string;
  timestamp: Date;
  nodeId: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
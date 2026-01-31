import { NodeType, NodeData, Connection } from './types';

export const INITIAL_NODES: NodeData[] = [
  {
    id: '1',
    type: NodeType.TRIGGER,
    label: 'Milestone: Concept Done',
    x: 100,
    y: 150,
    status: 'idle'
  },
  {
    id: '2',
    type: NodeType.ACTION,
    label: 'AI: Draft Client Update',
    x: 450,
    y: 100,
    status: 'idle'
  },
  {
    id: '3',
    type: NodeType.ACTION,
    label: 'AI: Gen. Insta Caption',
    x: 450,
    y: 250,
    status: 'idle'
  },
  {
    id: '4',
    type: NodeType.RESPONSE,
    label: 'WhatsApp: Send Preview',
    x: 800,
    y: 100,
    status: 'idle'
  },
  {
    id: '5',
    type: NodeType.RESPONSE,
    label: 'Save to Marketing',
    x: 800,
    y: 250,
    status: 'idle'
  },
  {
    id: '6',
    type: NodeType.ACTION,
    label: 'AI: Gen. Task Checklist',
    x: 100,
    y: 350,
    status: 'idle'
  }
];

export const INITIAL_EDGES: Connection[] = [
  { id: 'e1', from: '1', to: '2' },
  { id: 'e1b', from: '1', to: '3' },
  { id: 'e2', from: '2', to: '4' },
  { id: 'e3', from: '3', to: '5' },
];

export const MOCK_CONTRACT = `
PROJECT: Villa Serenity - Phase 2
CURRENT STATUS: Concept Design Finalized
KEY FEATURES:
- Sustainable bamboo facade
- Infinity pool integration with cliff edge
- Open-plan living with retractable glass walls
NEXT STEPS: Structural Engineering approval
TONE: Professional, Visionary, Warm
`;
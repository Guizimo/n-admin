export type AiInsightSeverity = 'low' | 'medium' | 'high';

export interface AiInsight {
  id: string;
  title: string;
  summary: string;
  severity: AiInsightSeverity;
  evidence: string[];
  recommendation: string;
}

export interface AiActionDraft {
  id: string;
  title: string;
  description: string;
  steps: string[];
  requiresApproval: boolean;
}

export interface AiPermissionExplanation {
  title: string;
  summary: string;
  details: string[];
}

export interface AiInsightsPayload {
  generatedAt: string;
  healthScore: number;
  summary: string;
  insights: AiInsight[];
  actionDrafts: AiActionDraft[];
  permissionExplanation: AiPermissionExplanation;
}

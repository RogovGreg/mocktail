import { TCheckServiceAvailability } from '../types';

export type TTemplate = { // TODO Move somewhere else
  id?: string;
  name: string;
  schema: string;
  projectId: string;
}


export type TBackendService = Readonly<{
  checkAvailability: TCheckServiceAvailability;
  getTemplates: (options?: any) => Promise<TTemplate[]>;
  creteTemplate: (data: TTemplate, options?: any) => Promise<TTemplate>;
  updateTemplate: (templateId: string, data: TTemplate, options?: any) => Promise<TTemplate>;
  deleteTemplate: (templateId: string, options?: any) => Promise<void>;
}>;


import { ModuleContent } from '@/components/training/ModuleDetail';
import { interchangeFeesModule } from './modules/interchangeFeesModule';
import { highRiskModule } from './modules/highRiskModule';
import { pciComplianceModule } from './modules/pciComplianceModule';
import { placeholderModules } from './modules/placeholderModules';

// Create an object mapping module IDs to their content
export const moduleContentMap: Record<number, ModuleContent> = {
  6: interchangeFeesModule,
  7: highRiskModule,
  8: pciComplianceModule,
  ...placeholderModules
};

// Function to get module content by ID
export const getModuleContent = (id: number): ModuleContent | undefined => {
  return moduleContentMap[id];
};

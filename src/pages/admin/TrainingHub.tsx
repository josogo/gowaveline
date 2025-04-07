
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { TabsContent } from '@/components/ui/tabs';
import { extendedGlossaryTerms } from '@/data';
import { 
  GlossarySection,
  ResourcesSection,
  LessonsSection,
  ModulesSection
} from '@/components/training';
import { TrainingHubHeader, TrainingHubTabs } from '@/components/training/trainingHub';
import TrainingDialog from '@/components/training/TrainingDialog';
import { additionalModules } from '@/data/additionalModules';
import { prepareLessonData, filterGlossaryTerms } from '@/utils/trainingHelpers';

const TrainingHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Prepare data
  const lessons = prepareLessonData();
  const filteredGlossaryTerms = filterGlossaryTerms(extendedGlossaryTerms, searchTerm);
  
  const handleOpenLesson = (index: number) => {
    setSelectedLesson(index);
    setSelectedModule(null);
    setIsDialogOpen(true);
  };

  const handleOpenModule = (moduleId: number) => {
    setSelectedModule(moduleId);
    setSelectedLesson(null);
    setIsDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <TrainingHubHeader 
          title="Merchant Services Training Hub"
          subtitle="Comprehensive onboarding for new sales professionals"
        />

        <TrainingHubTabs defaultTab="lessons">
          <TabsContent value="lessons" className="space-y-6">
            <LessonsSection lessons={lessons} onOpenLesson={handleOpenLesson} />
          </TabsContent>
          
          <TabsContent value="modules" className="space-y-6">
            <ModulesSection 
              modules={additionalModules}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              onOpenModule={handleOpenModule}
            />
          </TabsContent>
          
          <TabsContent value="glossary">
            <GlossarySection 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredGlossaryTerms={filteredGlossaryTerms}
            />
          </TabsContent>
          
          <TabsContent value="resources">
            <ResourcesSection />
          </TabsContent>
        </TrainingHubTabs>
      </div>
      
      <TrainingDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        selectedLesson={selectedLesson}
        selectedModule={selectedModule}
      />
    </AdminLayout>
  );
};

export default TrainingHub;

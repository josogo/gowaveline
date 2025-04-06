
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { extendedGlossaryTerms } from '@/data/lessonContent';
import { 
  GlossarySection,
  ResourcesSection,
  LessonsSection,
  ModulesSection
} from '@/components/training';
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-500">Merchant Services Training Hub</h1>
            <p className="text-muted-foreground mt-1">Comprehensive onboarding for new sales professionals</p>
          </div>
          <Badge variant="outline" className="bg-[#0EA5E9]/10 text-[#0EA5E9] px-3 py-1">
            Admin Access
          </Badge>
        </div>

        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="glossary">Glossary</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
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
        </Tabs>
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

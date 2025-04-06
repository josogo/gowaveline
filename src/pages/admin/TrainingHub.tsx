import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { lessonContents, extendedGlossaryTerms } from '@/data/lessonContent';
import { moduleContentMap } from '@/data/moduleContent';
import { 
  Lesson, 
  ModuleDetail,
  GlossarySection,
  ResourcesSection,
  LessonsSection,
  ModulesSection
} from '@/components/training';
import type { ModuleData } from '@/components/training/ModulesSection';

const lessons = lessonContents.map(lesson => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.description,
  duration: lesson.duration,
  topics: lesson.topics
}));

const additionalModules: ModuleData[] = [
  {
    id: 6,
    title: "Understanding Interchange Fees",
    description: "Learn how interchange fees work and how to explain them to merchants",
    category: "Processing Knowledge",
    duration: "45 minutes",
    difficulty: "Intermediate",
    topics: [
      "What are interchange fees?",
      "How networks determine rates",
      "Explaining fees to customers",
      "Optimizing processing for lower fees",
      "Industry-specific rate structures"
    ]
  },
  {
    id: 7,
    title: "High-Risk Merchant Account Sales",
    description: "Special considerations when working with high-risk industries",
    category: "Sales Techniques",
    duration: "60 minutes",
    difficulty: "Advanced",
    topics: [
      "Identifying high-risk industries",
      "Underwriting requirements",
      "Pricing strategies",
      "Risk mitigation techniques",
      "Compliance considerations"
    ]
  },
  {
    id: 8,
    title: "PCI Compliance Essentials",
    description: "Guide to helping merchants maintain PCI compliance",
    category: "Processing Knowledge",
    duration: "50 minutes",
    difficulty: "Beginner",
    topics: [
      "PCI DSS requirements overview",
      "SAQ types explained",
      "Common compliance pitfalls",
      "Helping merchants maintain compliance",
      "Security best practices"
    ]
  },
  {
    id: 9,
    title: "Effective Statement Analysis",
    description: "How to analyze merchant statements to identify savings",
    category: "Sales Techniques",
    duration: "75 minutes",
    difficulty: "Intermediate",
    topics: [
      "Identifying processing models",
      "Finding hidden fees",
      "Calculating effective rates",
      "Creating savings proposals",
      "Competitive positioning"
    ]
  },
  {
    id: 10,
    title: "eCommerce Processing Solutions",
    description: "Specialized knowledge for online merchant sales",
    category: "Processing Knowledge",
    duration: "60 minutes",
    difficulty: "Intermediate",
    topics: [
      "Payment gateway options",
      "Shopping cart integrations",
      "Mobile optimization",
      "Fraud prevention tools",
      "Recurring billing solutions"
    ]
  },
  {
    id: 11,
    title: "Chargeback Management",
    description: "Help merchants reduce and manage chargebacks effectively",
    category: "Processing Knowledge",
    duration: "45 minutes",
    difficulty: "Advanced",
    topics: [
      "Understanding chargeback reasons",
      "Prevention best practices",
      "Dispute resolution process",
      "Chargeback monitoring programs",
      "Risk thresholds and consequences"
    ]
  },
  {
    id: 12,
    title: "Restaurant Payment Processing",
    description: "Specialized solutions for the restaurant industry",
    category: "Sales Techniques",
    duration: "50 minutes",
    difficulty: "Beginner",
    topics: [
      "POS integration options",
      "Tip adjustment workflows",
      "Online ordering solutions",
      "QR code payments",
      "Delivery service integrations"
    ]
  },
  {
    id: 13,
    title: "Value-Added Services Sales",
    description: "Increase deal value with complementary offerings",
    category: "Sales Techniques",
    duration: "40 minutes",
    difficulty: "Intermediate",
    topics: [
      "Working capital programs",
      "Gift card solutions",
      "Loyalty programs",
      "Data analytics tools",
      "Customer engagement platforms"
    ]
  },
  {
    id: 14,
    title: "Contactless Payment Technologies",
    description: "Understanding modern payment acceptance methods",
    category: "Processing Knowledge",
    duration: "30 minutes",
    difficulty: "Beginner",
    topics: [
      "NFC technology explained",
      "Mobile wallet acceptance",
      "QR code payments",
      "Tap-to-pay terminals",
      "Security features and tokenization"
    ]
  },
  {
    id: 15,
    title: "Objection Handling Mastery",
    description: "Advanced techniques for overcoming sales objections",
    category: "Sales Techniques",
    duration: "55 minutes",
    difficulty: "Advanced",
    topics: [
      "Addressing price concerns",
      "Contract length objections",
      "Technology transition fears",
      "Building trust with skeptical merchants",
      "Competitive comparison strategies"
    ]
  }
];

const TrainingHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const filteredGlossaryTerms = extendedGlossaryTerms.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLesson !== null ? "Lesson" : "Training Module"}
            </DialogTitle>
          </DialogHeader>
          {selectedLesson !== null && (
            <Lesson 
              lesson={lessonContents[selectedLesson]} 
              onClose={() => setIsDialogOpen(false)} 
            />
          )}
          {selectedModule !== null && moduleContentMap[selectedModule] && (
            <ModuleDetail
              module={moduleContentMap[selectedModule]}
              onClose={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TrainingHub;


import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Book, BookOpen, Search, PlayCircle, FileText, MessageCircle, CheckCircle, Filter } from 'lucide-react';
import { lessonContents, extendedGlossaryTerms } from '@/data/lessonContent';
import { getModuleContent, moduleContentMap } from '@/data/moduleContent';
import { Lesson, TrainingModule, ModuleDetail } from '@/components/training';

// Simplified version of lessons for the card display
const lessons = lessonContents.map(lesson => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.description,
  duration: lesson.duration,
  topics: lesson.topics
}));

// Additional training modules based on blog content
const additionalModules = [
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
] as const;

const TrainingHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Filter glossary terms based on search
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

  // Get unique categories for filtering
  const categories = [...new Set(additionalModules.map(module => module.category))];
  
  // Filter modules based on category
  const filteredModules = categoryFilter 
    ? additionalModules.filter(module => module.category === categoryFilter)
    : additionalModules;
  
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
          
          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-3 bg-gradient-to-r from-orange-400 to-[#0EA5E9]"></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9]">
                        {lesson.id}
                      </span>
                      <span>{lesson.title}</span>
                    </CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{lesson.topics.length} Topics</span>
                      </div>
                      
                      <Accordion type="single" collapsible>
                        <AccordionItem value="topics">
                          <AccordionTrigger className="text-sm">
                            View Topics
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2 text-sm">
                              {lesson.topics.map((topic, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-[#0EA5E9]"
                          onClick={() => handleOpenLesson(lesson.id - 1)}
                        >
                          <PlayCircle className="mr-1 h-4 w-4" />
                          Start Lesson
                        </Button>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 flex items-center">
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* New Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#0EA5E9]">Advanced Training Modules</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select 
                  className="text-sm border rounded px-2 py-1"
                  value={categoryFilter || ''}
                  onChange={(e) => setCategoryFilter(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category, i) => (
                    <option key={i} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <TrainingModule
                  key={module.id}
                  id={module.id}
                  title={module.title}
                  description={module.description}
                  category={module.category}
                  duration={module.duration}
                  topics={module.topics}
                  difficulty={module.difficulty}
                  onClick={() => handleOpenModule(module.id)}
                />
              ))}
            </div>
          </TabsContent>
          
          {/* Glossary Tab */}
          <TabsContent value="glossary">
            <Card>
              <CardHeader>
                <CardTitle>Payment Processing Terms Glossary</CardTitle>
                <CardDescription>Search and learn common industry terminology</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search terms..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="space-y-4">
                  {filteredGlossaryTerms.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {filteredGlossaryTerms.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="font-medium hover:no-underline">
                            {item.term}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div>
                                <div className="font-medium text-sm text-gray-500 mb-1">Definition:</div>
                                <p>{item.definition}</p>
                              </div>
                              
                              <div>
                                <div className="font-medium text-sm text-gray-500 mb-1">Example:</div>
                                <p className="text-sm bg-gray-50 p-3 rounded">{item.example}</p>
                              </div>
                              
                              {item.simpleDefinition && (
                                <div className="bg-orange-50 p-3 rounded-md border border-orange-100 mt-3">
                                  <div className="font-medium text-orange-700 mb-1 text-sm">Explain Like I'm 5:</div>
                                  <p className="text-sm">{item.simpleDefinition}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No terms found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      {resource.icon}
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {resource.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-blue-600 cursor-pointer hover:underline">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Lesson/Module Dialog */}
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

// Resources Data
const resources = [
  {
    title: 'Sales Scripts',
    description: 'Ready-to-use scripts for different sales scenarios',
    icon: <MessageCircle className="h-5 w-5 text-orange-500" />,
    items: [
      'Cold Call Script.pdf',
      'Pricing Objection Handling.doc',
      'Contract Renewal Dialog.pdf',
      'Competitor Switch Script.doc',
      'High-Volume Merchant Pitch.pdf'
    ]
  },
  {
    title: 'Statement Analysis',
    description: 'Tools and templates for statement review',
    icon: <FileText className="h-5 w-5 text-[#0EA5E9]" />,
    items: [
      'Statement Analysis Worksheet.xlsx',
      'Fee Identification Guide.pdf',
      'Savings Calculator Template.xlsx',
      'Competitor Comparison Tool.pdf',
      'Hidden Fees Cheatsheet.pdf'
    ]
  },
  {
    title: 'Training Materials',
    description: 'Educational resources and reference guides',
    icon: <Book className="h-5 w-5 text-green-500" />,
    items: [
      'Payment Processing Handbook.pdf',
      'Interchange Categories Guide.pdf',
      'High-Risk Industry Guidelines.doc',
      'PCI Compliance Checklist.pdf',
      'Equipment Comparison Guide.xlsx'
    ]
  }
];

export default TrainingHub;

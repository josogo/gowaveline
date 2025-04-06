
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
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Book, BookOpen, Search, PlayCircle, FileText, MessageCircle, CheckCircle } from 'lucide-react';

const TrainingHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter glossary terms based on search
  const filteredGlossaryTerms = glossaryTerms.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
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
                        {index + 1}
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
                        <DrawerTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-[#0EA5E9]"
                          >
                            <PlayCircle className="mr-1 h-4 w-4" />
                            Start Lesson
                          </Button>
                        </DrawerTrigger>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 flex items-center">
                          {lesson.duration}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Drawer>
              <DrawerContent className="max-h-[90%] p-6">
                <div className="mx-auto max-w-4xl">
                  <h3 className="text-2xl font-bold text-[#0EA5E9] mb-2">Lesson Preview</h3>
                  <p className="text-muted-foreground mb-6">This module is under development. Full interactive lessons coming soon!</p>
                  
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <PlayCircle className="h-16 w-16 text-[#0EA5E9] mx-auto mb-4" />
                    <p className="text-lg font-medium">Interactive video lessons with quizzes</p>
                    <p className="text-sm text-muted-foreground mt-2">Learn at your own pace with expert-guided tutorials</p>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
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
    </AdminLayout>
  );
};

// Lesson Data
const lessons = [
  {
    title: 'What Happens in a Credit Card Transaction?',
    description: 'Understand every stage of the payment journey from initial swipe to settlement',
    duration: '30 min',
    topics: [
      'Card networks and issuers',
      'Authorization and settlement processes',
      'Transaction fees breakdown',
      'What happens behind the scenes',
      'Common transaction issues'
    ]
  },
  {
    title: 'The 5 Core Players in Merchant Services',
    description: 'Learn about processors, gateways, acquirers, ISOs and more',
    duration: '45 min',
    topics: [
      'Processors (Fiserv, TSYS, Elavon)',
      'Acquirers (Wells Fargo, Chase)',
      'Gateways (Authorize.net, NMI)',
      'ISOs vs. MSPs explained',
      'Where your company fits in the ecosystem'
    ]
  },
  {
    title: 'Pricing Models & Profit Margins',
    description: 'Master the different pricing structures and understand profit margins',
    duration: '50 min',
    topics: [
      'Interchange Plus pricing',
      'Tiered pricing structures',
      'Flat rate models (Square, Stripe)',
      'Subscription/wholesale models',
      'Calculating merchant effective rates'
    ]
  },
  {
    title: 'Reading a Merchant Statement',
    description: 'Become an expert at analyzing and explaining merchant statements',
    duration: '60 min',
    topics: [
      'Statement components and structure',
      'Finding hidden fees',
      'Calculating effective rates',
      'Identifying savings opportunities',
      'Red flags in competitor statements'
    ]
  },
  {
    title: 'Risk, Compliance, and Chargebacks',
    description: 'Understand the risk factors in merchant processing and how to mitigate them',
    duration: '45 min',
    topics: [
      'PCI DSS requirements',
      'High-risk vs. low-risk merchants',
      'Chargeback process explained',
      'Fraud prevention strategies',
      'Compliance best practices'
    ]
  },
  {
    title: 'Sales Training & Objection Handling',
    description: 'Master the art of sales in the payment processing industry',
    duration: '75 min',
    topics: [
      'Effective merchant discovery calls',
      'Overcoming common objections',
      'Creating compelling proposals',
      'Contract negotiation techniques',
      'Follow-up and closing strategies'
    ]
  }
];

// Glossary Terms Data
const glossaryTerms = [
  {
    term: 'Merchant Account',
    definition: 'A type of bank account that allows businesses to accept credit or debit card payments from customers, with funds deposited directly into the merchant\'s account.',
    example: 'When Joe\'s Coffee Shop signs up with a payment processor, they receive a merchant account that enables them to process Visa, Mastercard, and other card payments.',
    simpleDefinition: 'It\'s like a special bank account that lets a business accept credit card payments from customers.'
  },
  {
    term: 'Interchange Fees',
    definition: 'Fees paid by the merchant\'s bank (acquirer) to the customer\'s bank (issuer) when a card transaction occurs. These fees vary based on card type, transaction method, and risk factors.',
    example: 'On a $100 purchase with a rewards credit card, the interchange fee might be 2.10% + $0.10, or $2.20 total.',
    simpleDefinition: 'Money that goes to the customer\'s bank every time someone uses their credit card at a store.'
  },
  {
    term: 'Basis Points (BPS)',
    definition: 'A unit of measure used in financial contexts equal to 1/100th of a percentage point (0.01%). Often used to express differences in interest rates or payment processing fees.',
    example: 'A processor quoting "interchange plus 25 basis points" means they charge 0.25% above the interchange rate.',
    simpleDefinition: 'A tiny piece of a percentage. 100 basis points = 1%.'
  },
  {
    term: 'Authorization',
    definition: 'The process of verifying that a customer\'s card is valid and has sufficient funds to cover a transaction, without actually transferring the money.',
    example: 'When you tap your card at a restaurant, the authorization holds the funds but doesn\'t transfer them until the merchant batches out at the end of the day.',
    simpleDefinition: 'Checking if a card is good and has enough money before saying "yes" to a purchase.'
  },
  {
    term: 'Settlement',
    definition: 'The process where authorized transactions are processed, and funds are transferred from the customer\'s account to the merchant\'s account.',
    example: 'Though Jon\'s purchase was authorized at 2 PM, the actual settlement occurred when the merchant batched their transactions at midnight.',
    simpleDefinition: 'When the money actually moves from the customer\'s card to the store\'s bank account.'
  },
  {
    term: 'BIN (Bank Identification Number)',
    definition: 'The first 6 digits of a payment card number that identify the issuing bank or financial institution.',
    example: 'By looking at the BIN 411111, a payment processor can identify that this is a Visa card issued by a specific bank.',
    simpleDefinition: 'The first few numbers on a credit card that tell us which bank it belongs to.'
  },
  {
    term: 'Gateway',
    definition: 'A service that authorizes credit card payments for online and in-person businesses by transmitting transaction data between merchants, processors, and banks.',
    example: 'Authorize.net serves as a gateway, connecting Jane\'s online store to the payment processor to enable credit card transactions.',
    simpleDefinition: 'The digital doorway that connects an online store to the payment system.'
  },
  {
    term: 'Processor',
    definition: 'A company that handles credit card transactions by passing information between merchants, card networks, and banks.',
    example: 'TSYS, as a processor, manages the flow of transaction data between Mary\'s hardware store, Visa, and the issuing banks.',
    simpleDefinition: 'The company that moves information around to make credit card payments work.'
  },
  {
    term: 'Acquirer',
    definition: 'A financial institution that processes credit or debit card payments on behalf of a merchant, enabling businesses to accept card payments.',
    example: 'Wells Fargo Merchant Services acts as Mike\'s Pizza Shop\'s acquirer, providing the merchant account and processing infrastructure.',
    simpleDefinition: 'The merchant\'s bank that helps them accept credit card payments.'
  },
  {
    term: 'ISO (Independent Sales Organization)',
    definition: 'A third-party company authorized to handle merchant accounts and payment processing services on behalf of a larger financial institution or acquirer.',
    example: 'The local payment processing company that signed up City Bakery is an ISO, reselling Chase Paymentech\'s processing services.',
    simpleDefinition: 'A company that sells payment processing services on behalf of bigger banks.'
  }
];

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

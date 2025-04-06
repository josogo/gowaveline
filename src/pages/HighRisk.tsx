
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, AlertTriangle, DollarSign, BarChart, Building, Globe, ArrowRight, ArrowLeft } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const HighRisk = () => {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const industries = [
    {
      id: 1,
      title: "CBD & Cannabis",
      description: "Legal CBD and cannabis businesses face unique payment processing challenges. We provide compliant solutions that keep your business running smoothly.",
      icon: <AlertTriangle className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "Our specialized CBD & Cannabis payment solutions include compliant merchant accounts that understand the legal distinctions in your industry, chargeback protection systems tailored for high-risk verticals, and banking relationships with institutions that specifically support cannabis-adjacent businesses. We'll help you navigate the complex regulatory landscape while maintaining reliable payment processing."
    },
    {
      id: 2,
      title: "Firearms & Ammunition",
      description: "Gun shops and firearm dealers need specialized processing. Our team understands the regulatory landscape and can help you navigate payment solutions.",
      icon: <ShieldCheck className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "For firearms and ammunition retailers, we offer specialized high-risk merchant accounts that comply with federal regulations, secure payment gateways with enhanced fraud detection for weapon sales, and ongoing compliance monitoring to keep your business operating within legal boundaries. Our solutions ensure you can process payments reliably while adhering to all applicable laws."
    },
    {
      id: 3,
      title: "Adult Content & Dating",
      description: "Adult websites, content creators, and dating platforms require discreet, reliable payment processing that traditional banks often deny.",
      icon: <CreditCard className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "Our adult industry solutions include discreet billing descriptors that protect customer privacy, high-volume processing capabilities for subscription-based models, and specialized fraud prevention tools designed for dating and content platforms. We work with acquiring banks that understand your business model and won't suddenly terminate your account based on industry type."
    },
    {
      id: 4,
      title: "Cryptocurrency & Digital Assets",
      description: "Crypto exchanges, NFT marketplaces, and blockchain startups need payment solutions that bridge traditional finance and digital assets.",
      icon: <DollarSign className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "For cryptocurrency and digital asset businesses, we provide payment solutions that bridge traditional and digital finance, with fiat on/off ramp processing capabilities, multi-currency support for global operations, and enhanced security protocols designed for blockchain-related transactions. Our banking partners understand the unique nature of crypto businesses and provide stable processing solutions."
    },
    {
      id: 5,
      title: "Peptides & Nutraceuticals",
      description: "Research chemicals, peptides, and supplement companies face high decline rates with conventional processors. Our solutions minimize this risk.",
      icon: <BarChart className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "Our nutraceutical and peptide merchant solutions include specialized underwriting that understands your product categories, compliant payment gateways that reduce declines and chargebacks, and recurring billing solutions optimized for subscription-based supplement sales. We'll help you navigate the complex regulations while keeping your payment processing stable and reliable."
    },
    {
      id: 6,
      title: "Startups & New Ventures",
      description: "Early-stage companies with limited processing history often struggle to secure merchant accounts. We specialize in helping startups establish payment infrastructure.",
      icon: <Building className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "For startups and new ventures, we offer flexible merchant accounts with growth-friendly terms, scalable payment solutions that grow with your business, and risk assessment services that help you establish a positive processing history. Our startup-friendly approach means we can often approve businesses with limited history where traditional processors would decline."
    },
    {
      id: 7,
      title: "AI & Emerging Technologies",
      description: "AI services, virtual companions, and cutting-edge tech companies need payment solutions that understand their unique business models.",
      icon: <Globe className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "For AI and emerging technology businesses, we provide forward-thinking payment solutions that accommodate innovative business models, international processing capabilities for global tech services, and subscription management tools designed for SaaS and AI service providers. Our tech-savvy underwriting team understands novel business concepts that traditional banks often misclassify."
    },
    {
      id: 8,
      title: "Tobacco & E-cigarettes",
      description: "Vape shops, tobacco retailers, and e-cigarette manufacturers require specialized processing solutions to overcome regulatory hurdles.",
      icon: <AlertTriangle className="h-10 w-10 text-[#0EA5E9]" />,
      helpText: "Our tobacco and e-cigarette payment solutions include compliant merchant accounts familiar with age verification requirements, specialized fraud protection designed for vape and tobacco sales, and processing capabilities that work with the unique regulatory challenges of your industry. We'll help you navigate changing regulations while maintaining reliable payment processing."
    },
  ];

  const handleIndustryClick = (industry) => {
    setSelectedIndustry(selectedIndustry?.id === industry.id ? null : industry);
  };

  const carouselImages = [
    "/lovable-uploads/2d9abfe8-af53-43b1-9ce4-d5c73518ff44.png",
    "/lovable-uploads/1273f62c-7839-4ba0-adb3-a65f0f996b3f.png",
    "/lovable-uploads/13e5ff13-2a8e-45f3-b1bc-ed972c3308ba.png",
    "/lovable-uploads/db137242-a816-462b-8d10-96fde441aaa3.png",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-orange-50 to-transparent py-16 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#0EA5E9]">High Risk Payment Processing Solutions</h1>
            <p className="text-xl text-[#0EA5E9] mb-8 max-w-3xl mx-auto">
              When traditional payment processors say "no," Waveline says "let's find a way." We specialize in providing reliable merchant services to businesses in high-risk industries.
            </p>
            
            <div className="max-w-6xl mx-auto my-12">
              <Carousel className="w-full">
                <CarouselContent>
                  {carouselImages.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-0">
                            <img src={image} alt={`High Risk Industry ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Button 
                onClick={() => navigate('/')}
                className="px-6 py-3 text-white font-semibold text-lg rounded-lg bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] shadow-lg"
              >
                Analyze Statement
              </Button>
              <Button 
                onClick={() => navigate('/contact')}
                variant="outline" 
                className="px-6 py-3 border-[#0EA5E9] text-[#0EA5E9] font-semibold text-lg"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
        
        <div className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-[#0EA5E9]">Industries We Serve</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry) => (
                <div 
                  key={industry.id} 
                  className={`bg-white rounded-lg shadow-lg p-8 border border-gray-100 transition-all cursor-pointer ${selectedIndustry?.id === industry.id ? 'ring-2 ring-[#0EA5E9]' : 'hover:shadow-xl'}`}
                  onClick={() => handleIndustryClick(industry)}
                >
                  <div className="mb-4">
                    {industry.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">{industry.title}</h3>
                  
                  {selectedIndustry?.id === industry.id ? (
                    <div className="animate-fade-in">
                      <p className="text-[#0EA5E9]/80 mb-6">{industry.helpText}</p>
                      <Button 
                        variant="link" 
                        className="text-[#0EA5E9] p-0 font-medium flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/contact');
                        }}
                      >
                        Get a solution <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[#0EA5E9]/80 mb-6">{industry.description}</p>
                      <Button 
                        variant="link" 
                        className="text-[#0EA5E9] p-0 font-medium flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIndustryClick(industry);
                        }}
                      >
                        How we can help <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-16 p-8 bg-gradient-to-r from-[#0EA5E9]/10 to-[#0EA5E9]/5 rounded-xl text-center">
              <h3 className="text-2xl font-bold mb-4 text-[#0EA5E9]">Don't See Your Industry?</h3>
              <p className="text-[#0EA5E9] mb-6 max-w-2xl mx-auto">
                We work with many other high-risk industries not listed here. If you're struggling to find payment processing for your business, we likely have a solution.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white"
              >
                Discuss Your Needs
              </Button>
            </div>
          </div>
        </div>
        
        <div className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#0EA5E9]">Why Choose Waveline for High-Risk Processing?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 text-left">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Industry Expertise</h3>
                <p className="text-[#0EA5E9]/80">
                  Our team has decades of combined experience working with businesses in high-risk verticals. We understand your unique challenges.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Multiple Banking Relationships</h3>
                <p className="text-[#0EA5E9]/80">
                  We maintain strong partnerships with domestic and offshore banks that specialize in high-risk merchant accounts.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Competitive Rates</h3>
                <p className="text-[#0EA5E9]/80">
                  We work to secure the most favorable terms possible, even for businesses in challenging industries.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-3 text-[#0EA5E9]">Chargeback Protection</h3>
                <p className="text-[#0EA5E9]/80">
                  Our solutions include advanced fraud detection and chargeback mitigation tools specifically designed for high-risk businesses.
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Button 
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/80 hover:from-[#0EA5E9]/80 hover:to-[#0EA5E9] text-white"
              >
                Analyze Your Statement
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HighRisk;

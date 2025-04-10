
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { motion } from 'framer-motion';

const images = [
  "/lovable-uploads/73f46803-d80f-4a1a-a02d-d179b57d0050.png",
  "/lovable-uploads/8abdeb16-b6eb-43a3-bc73-b23e9079a081.png",
  "/lovable-uploads/cc5ef7ae-49c9-40b5-83a2-e4ec662f44b9.png",
  "/lovable-uploads/fb62237e-44d2-446d-bdbb-f3b5ba4f0a3d.png",
  "/lovable-uploads/cc99e0f4-6cf2-42e7-b46e-1231d54e23c6.png",
  "/lovable-uploads/717aaecf-c0ee-4287-acff-6daa54aad5ba.png",
  "/lovable-uploads/b79405a9-49b4-4143-8dee-0177ff10a664.png",
  "/lovable-uploads/cac6bc82-4be4-4dde-ad99-e7cbfa590aff.png",
  "/lovable-uploads/b3f7a727-4023-4b96-8c05-dbfd3e476ed9.png"
];

const ImageCarousel = () => {
  const [api, setApi] = useState<any>(null);
  
  useEffect(() => {
    if (!api) return;
    
    // Auto-scroll continuously with smooth motion
    const intervalId = setInterval(() => {
      api.scrollNext({ animation: "tween", duration: 1000 });
    }, 4000);
    
    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-[#FF9F5A]/5 via-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF9F5A] to-[#0EA5E9]">
          High Risk Industry Insights
        </h2>
        
        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true
          }}
        >
          <CarouselContent className="-ml-4">
            {images.map((src, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <motion.div 
                  className="relative h-full overflow-hidden"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 p-3 flex flex-col items-center justify-center h-full transform transition-all duration-300 hover:shadow-xl relative">
                    {/* Glossy effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl opacity-50"></div>
                    
                    {/* Soft glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-[#FF9F5A]/5 blur-md"></div>
                    
                    {/* Image container with soft shadow */}
                    <div className="relative z-10 rounded-xl overflow-hidden w-full h-48 bg-white shadow-inner">
                      <img 
                        src={src} 
                        alt={`High risk industry illustration ${index + 1}`}
                        className="w-full h-full object-contain p-2 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Neumorphic bottom edge effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-100/50 to-transparent rounded-b-2xl"></div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious 
              className="static transform-none mx-2 bg-gradient-to-r from-[#FF9F5A] to-[#FF7F37] hover:from-[#FF7F37] hover:to-[#FF9F5A] text-white border-none rounded-full shadow-md" 
            />
            <CarouselNext 
              className="static transform-none mx-2 bg-gradient-to-r from-[#FF9F5A] to-[#FF7F37] hover:from-[#FF7F37] hover:to-[#FF9F5A] text-white border-none rounded-full shadow-md" 
            />
          </div>
        </Carousel>
        
        <p className="text-center mt-8 text-gray-500 italic">
          Explore our industry knowledge and expertise in navigating high-risk payment processing
        </p>
      </div>
    </div>
  );
};

export default ImageCarousel;

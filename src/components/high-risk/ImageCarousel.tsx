
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import AnimatedText from '@/components/AnimatedText';

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
    
    // Auto-scroll continuously without pausing
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <AnimatedText type="slide" direction="up" className="text-3xl font-bold mb-12 text-center text-[#0EA5E9]">
          <h2>High Risk Industry Insights</h2>
        </AnimatedText>
        
        <Carousel 
          setApi={setApi}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            skipSnaps: true,
            dragFree: true
          }}
        >
          <CarouselContent className="-ml-4">
            {images.map((src, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                {/* Remove animation from images to ensure they show properly */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 h-full">
                  <img 
                    src={src} 
                    alt={`High risk industry illustration ${index + 1}`}
                    className="w-full h-64 object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        <AnimatedText type="fade" delay={400} className="text-center mt-8 text-gray-500 italic">
          <p>Images showcasing various high-risk industries we serve</p>
        </AnimatedText>
      </div>
    </div>
  );
};

export default ImageCarousel;

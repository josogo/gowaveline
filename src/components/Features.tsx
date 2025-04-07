
import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  ArrowUp, 
  ArrowDown,
  Layers,
  FileSearch,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AnimatedText from '@/components/AnimatedText';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description,
  className,
  delay
}) => {
  return (
    <AnimatedText type="slide" direction="up" delay={delay} className={cn(
      "p-6 rounded-xl border bg-card transition-all hover:shadow-md", 
      className
    )}>
      <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[#0EA5E9]">{title}</h3>
      <p className="text-orange-500">{description}</p>
    </AnimatedText>
  );
};

const Features = () => {
  return (
    <div className="py-20 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <AnimatedText type="fade" delay={100} className="text-3xl md:text-4xl font-bold mb-4 text-[#0EA5E9]">
          <h2>Powerful Statement Analysis</h2>
        </AnimatedText>
        <AnimatedText type="fade" delay={300}>
          <p className="text-xl text-orange-500 max-w-3xl mx-auto">
            Our advanced analytics engine breaks down your merchant statements to provide actionable insights.
          </p>
        </AnimatedText>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<BarChart3 size={24} />}
          title="Effective Rate Analysis"
          description="Get your true processing rate, calculated by dividing total fees by total volume."
          delay={400}
        />
        
        <FeatureCard
          icon={<Layers size={24} />}
          title="Fee Categorization"
          description="See a breakdown of percentage fees, per-transaction fees, and flat monthly charges."
          className="md:translate-y-6"
          delay={500}
        />
        
        <FeatureCard
          icon={<PieChart size={24} />}
          title="Pricing Model Detection"
          description="We automatically identify if you're on interchange-plus or tiered pricing."
          delay={600}
        />
        
        <FeatureCard
          icon={<ArrowDown size={24} />}
          title="Hidden Fee Detection"
          description="Discover non-transactional fees that may be inflating your costs."
          className="lg:translate-y-6"
          delay={700}
        />
        
        <FeatureCard
          icon={<FileSearch size={24} />}
          title="Statement Comparison"
          description="Compare multiple statements to track changes in fees over time."
          delay={800}
        />
        
        <FeatureCard
          icon={<AlertCircle size={24} />}
          title="Chargeback Monitoring"
          description="Track your chargeback ratio to stay within acceptable limits."
          className="md:translate-y-6"
          delay={900}
        />
      </div>
    </div>
  );
};

export default Features;

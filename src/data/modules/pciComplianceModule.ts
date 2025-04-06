
import { ModuleContent } from '@/components/training/ModuleDetail';

export const pciComplianceModule: ModuleContent = {
  id: 8,
  title: "PCI Compliance Essentials",
  description: "Guide to helping merchants maintain PCI compliance",
  duration: "50 minutes",
  sections: [
    {
      title: "PCI DSS Requirements Overview",
      content: `
        <p>The Payment Card Industry Data Security Standard (PCI DSS) is a set of security standards designed to ensure all companies that accept, process, store, or transmit credit card information maintain a secure environment.</p>
        <p>The standard is organized into six main objectives:</p>
        <ol>
          <li>Build and maintain a secure network and systems</li>
          <li>Protect cardholder data</li>
          <li>Maintain a vulnerability management program</li>
          <li>Implement strong access control measures</li>
          <li>Regularly monitor and test networks</li>
          <li>Maintain an information security policy</li>
        </ol>
        <p>These objectives are broken down into 12 main requirements that merchants must follow to be compliant.</p>
      `
    },
    {
      title: "Self-Assessment Questionnaire (SAQ) Types",
      content: `
        <p>Different merchant types complete different SAQs based on how they process payments:</p>
        <ul>
          <li><strong>SAQ A:</strong> Card-not-present merchants that have fully outsourced payment processing</li>
          <li><strong>SAQ A-EP:</strong> E-commerce merchants that outsource payment processing but control website</li>
          <li><strong>SAQ B:</strong> Merchants using imprint machines or standalone terminals with no electronic storage</li>
          <li><strong>SAQ B-IP:</strong> Merchants using standalone, PTS-approved payment terminals</li>
          <li><strong>SAQ C:</strong> Merchants with payment application systems connected to the internet</li>
          <li><strong>SAQ C-VT:</strong> Merchants using web-based virtual terminals</li>
          <li><strong>SAQ D:</strong> All other merchants and service providers</li>
        </ul>
        <p>Helping merchants identify the correct SAQ can significantly simplify their compliance process.</p>
      `,
      image: "/lovable-uploads/13e5ff13-2a8e-45f3-b1bc-ed972c3308ba.png"
    },
    {
      title: "Common Compliance Pitfalls",
      content: `
        <p>Merchants often struggle with these common compliance issues:</p>
        <ul>
          <li><strong>Scope creep:</strong> Unnecessarily increasing their compliance burden by storing card data when not needed</li>
          <li><strong>Weak passwords:</strong> Using default or simple passwords for payment systems</li>
          <li><strong>Improper network segmentation:</strong> Failing to isolate payment systems from other business networks</li>
          <li><strong>Insufficient logging:</strong> Not tracking access to networks and cardholder data</li>
          <li><strong>Delayed patches:</strong> Failing to update systems promptly when security patches are released</li>
          <li><strong>Incomplete documentation:</strong> Missing written security policies and procedures</li>
        </ul>
        <p>Addressing these common issues proactively can prevent compliance failures and security breaches.</p>
      `
    },
    {
      title: "Helping Merchants Maintain Compliance",
      content: `
        <p>As a merchant services provider, you can help merchants maintain PCI compliance by:</p>
        <ol>
          <li><strong>Offering compliant solutions:</strong> Recommending P2PE and tokenization solutions that reduce compliance scope</li>
          <li><strong>Providing education:</strong> Explaining compliance requirements in simple terms</li>
          <li><strong>Simplifying the process:</strong> Offering PCI compliance assistance programs</li>
          <li><strong>Regular check-ins:</strong> Following up quarterly about security practices</li>
          <li><strong>Breach protection:</strong> Offering programs that help cover costs in case of a breach</li>
        </ol>
        <div class="bg-blue-50 p-4 rounded-md border border-blue-100 my-4">
          <p class="font-medium">Value proposition:</p>
          <p>"Our PCI compliance assistance program helps simplify the complex requirements into manageable steps, ensuring your business remains protected while reducing your liability."</p>
        </div>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Which SAQ type would be appropriate for an online store that redirects customers to a payment processor's page for checkout?",
        options: [
          "SAQ A",
          "SAQ B",
          "SAQ C",
          "SAQ D"
        ],
        correctAnswer: 0
      },
      {
        question: "Which of the following is NOT one of the six main PCI DSS objectives?",
        options: [
          "Build and maintain a secure network and systems",
          "Regularly monitor and test networks",
          "Implement sustainable environmental practices",
          "Maintain a vulnerability management program"
        ],
        correctAnswer: 2
      },
      {
        question: "What technology can help reduce a merchant's PCI compliance burden by removing card data from their environment?",
        options: [
          "SQL databases",
          "Point-to-Point Encryption (P2PE)",
          "Open-source payment software",
          "On-premises payment servers"
        ],
        correctAnswer: 1
      },
      {
        question: "How often should merchants typically complete PCI compliance validation?",
        options: [
          "Monthly",
          "Quarterly",
          "Annually",
          "Every two years"
        ],
        correctAnswer: 2
      },
      {
        question: "What is a common compliance pitfall for merchants?",
        options: [
          "Using too many security measures",
          "Segmenting their network too strictly",
          "Using default or simple passwords for payment systems",
          "Updating systems too frequently"
        ],
        correctAnswer: 2
      }
    ]
  }
};

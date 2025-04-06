
import { ModuleContent } from '@/components/training/ModuleDetail';

// Module Content for "Understanding Interchange Fees"
export const interchangeFeesModule: ModuleContent = {
  id: 6,
  title: "Understanding Interchange Fees",
  description: "Learn how interchange fees work and how to explain them to merchants",
  duration: "45 minutes",
  sections: [
    {
      title: "What are Interchange Fees?",
      content: `
        <p>Interchange fees are transaction fees that the merchant's bank account must pay whenever a customer uses a credit/debit card to make a purchase. The fee is paid to the card-issuing bank to cover handling costs, fraud and bad debt costs and the risk involved in approving the payment.</p>
        <p>Key points about interchange fees:</p>
        <ul>
          <li>Set by card networks (Visa, Mastercard, etc.), not by payment processors</li>
          <li>Typically consists of a percentage plus a fixed fee (e.g., 1.65% + $0.10)</li>
          <li>Varies based on card type, transaction type, and merchant industry</li>
          <li>Comprises the largest portion of credit card processing costs</li>
        </ul>
      `,
      image: "/lovable-uploads/1273f62c-7839-4ba0-adb3-a65f0f996b3f.png"
    },
    {
      title: "How Networks Determine Rates",
      content: `
        <p>Card networks set interchange rates based on several risk factors and business considerations:</p>
        <h4 class="font-medium mt-4 mb-2">Risk Assessment Factors:</h4>
        <ul>
          <li><strong>Card-present vs. Card-not-present:</strong> In-person transactions have lower rates than online transactions due to lower fraud risk</li>
          <li><strong>Industry type:</strong> Some industries have higher chargeback rates and therefore higher interchange rates</li>
          <li><strong>Transaction size:</strong> Some categories have different rates for different transaction sizes</li>
          <li><strong>Card type:</strong> Premium rewards cards typically have higher interchange rates than standard cards</li>
        </ul>
        <p class="my-3">Networks publish interchange fee schedules twice a year (April and October), and these schedules can include hundreds of different rate categories.</p>
      `
    },
    {
      title: "Explaining Fees to Customers",
      content: `
        <p>When explaining interchange fees to merchants, focus on these key points:</p>
        <ul>
          <li><strong>Transparency:</strong> Emphasize that interchange is a cost set by card networks that all processors must pay</li>
          <li><strong>Value proposition:</strong> These fees enable card acceptance, which increases sales and average ticket size</li> 
          <li><strong>Optimization:</strong> Discuss how proper setup can help minimize interchange fees</li>
          <li><strong>Processing models:</strong> Explain the difference between tiered pricing, interchange-plus, and flat-rate models</li>
        </ul>
        <div class="bg-blue-50 p-4 rounded-md border border-blue-100 my-4">
          <p class="font-medium">Sample explanation for merchants:</p>
          <p>"Interchange fees are what the banks charge for processing card payments. Think of it as the wholesale cost of accepting cards. While we can't change these rates set by Visa and Mastercard, we can help ensure your business is set up to qualify for the lowest possible rates."</p>
        </div>
      `
    },
    {
      title: "Optimizing Processing for Lower Fees",
      content: `
        <p>Help merchants qualify for lower interchange rates with these best practices:</p>
        <ol>
          <li><strong>Proper business category codes:</strong> Ensure the merchant's MCC accurately reflects their business</li>
          <li><strong>Address Verification Service (AVS):</strong> For card-not-present transactions, use AVS to potentially qualify for better rates</li>
          <li><strong>Batch timing:</strong> Settle transactions within 24 hours</li>
          <li><strong>Proper card entry methods:</strong> Use EMV chip technology or contactless payments when possible</li>
          <li><strong>Level 2/3 data:</strong> For B2B transactions, provide additional transaction data to qualify for lower rates</li>
        </ol>
        <p class="mt-3">By implementing these practices, merchants can often save 0.25% to 1.00% on their effective processing rate.</p>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Who sets interchange fees?",
        options: [
          "Payment processors like Square or Stripe",
          "Card networks like Visa and Mastercard",
          "The merchant's bank",
          "Government financial regulators"
        ],
        correctAnswer: 1
      },
      {
        question: "Which of the following typically has the LOWEST interchange fees?",
        options: [
          "Online transaction with a rewards credit card",
          "In-person transaction with a debit card",
          "Phone order with a business credit card",
          "Recurring billing with a standard credit card"
        ],
        correctAnswer: 1
      },
      {
        question: "How often do card networks update their interchange rates?",
        options: [
          "Monthly",
          "Quarterly",
          "Twice a year (April and October)",
          "Once a year"
        ],
        correctAnswer: 2
      },
      {
        question: "Which of the following would help a merchant qualify for lower interchange rates?",
        options: [
          "Manually entering card numbers instead of using chip readers",
          "Batching transactions weekly to reduce processing events",
          "Using Address Verification Service for online transactions",
          "Charging higher transaction amounts"
        ],
        correctAnswer: 2
      },
      {
        question: "What is an effective way to explain interchange fees to merchants?",
        options: [
          "Tell them interchange fees are negotiable if they complain enough",
          "Explain that these fees are the wholesale cost of accepting cards",
          "Recommend they only accept cash to avoid fees entirely",
          "Suggest they add surcharges to all card transactions"
        ],
        correctAnswer: 1
      }
    ]
  }
};

// Module Content for "High-Risk Merchant Account Sales"
export const highRiskModule: ModuleContent = {
  id: 7,
  title: "High-Risk Merchant Account Sales",
  description: "Special considerations when working with high-risk industries",
  duration: "60 minutes",
  sections: [
    {
      title: "Identifying High-Risk Industries",
      content: `
        <p>High-risk merchant accounts are those that card processors and banks consider to have a higher potential for chargebacks, fraud, or legal issues. Common high-risk industries include:</p>
        <ul>
          <li>Adult entertainment and products</li>
          <li>Online gambling and gaming</li>
          <li>Nutraceuticals and supplements</li>
          <li>CBD and cannabis-related businesses</li>
          <li>Travel agencies and ticket brokers</li>
          <li>Debt collection and credit repair</li>
          <li>Subscription services with free trials</li>
          <li>Firearms and weapons</li>
          <li>Dating services</li>
        </ul>
        <p>Understanding which industries are considered high-risk is essential for setting proper expectations about pricing, contract terms, and underwriting requirements.</p>
      `,
      image: "/lovable-uploads/2d9abfe8-af53-43b1-9ce4-d5c73518ff44.png"
    },
    {
      title: "Underwriting Requirements",
      content: `
        <p>High-risk merchant accounts undergo more thorough underwriting processes. Be prepared to request the following from merchants:</p>
        <ul>
          <li><strong>Business documentation:</strong> Articles of incorporation, business licenses, EIN documentation</li>
          <li><strong>Processing history:</strong> 3-6 months of previous processing statements</li>
          <li><strong>Bank statements:</strong> 3-6 months of business bank statements</li>
          <li><strong>Financial statements:</strong> Profit & loss statements, balance sheets</li>
          <li><strong>Personal identification:</strong> Owner ID and SSN for personal credit checks</li>
          <li><strong>Website/marketing review:</strong> Terms of service, privacy policy, return policy</li>
          <li><strong>Product documentation:</strong> Product descriptions, fulfillment process details</li>
        </ul>
        <p>The more complete this documentation is when submitted, the faster the approval process will typically be.</p>
      `
    },
    {
      title: "Pricing Strategies",
      content: `
        <p>High-risk merchants will pay higher rates than standard merchants. Key pricing elements include:</p>
        <ul>
          <li><strong>Higher processing rates:</strong> Typically 1-2% higher than standard merchant accounts</li>
          <li><strong>Reserve requirements:</strong> Rolling reserve (portion of each transaction held), up-front reserve, or minimum balance requirements</li>
          <li><strong>Longer contract terms:</strong> Often 2-3 year minimums with early termination fees</li>
          <li><strong>Monthly minimums:</strong> Higher monthly minimum processing volume requirements</li>
          <li><strong>Set-up fees:</strong> One-time fees for account establishment</li>
        </ul>
        <div class="bg-orange-50 p-4 rounded-md border border-orange-100 my-4">
          <p class="font-medium">Sales tip:</p>
          <p>When discussing pricing, emphasize value rather than cost. High-risk merchants understand they'll pay more, but they care most about reliable processing that won't suddenly get shut down.</p>
        </div>
      `
    },
    {
      title: "Risk Mitigation Techniques",
      content: `
        <p>Help your merchants reduce their risk profile with these techniques:</p>
        <ol>
          <li><strong>Clear return/refund policies:</strong> Prominently displayed on website and at point of sale</li>
          <li><strong>Customer verification:</strong> Implementing AVS, CVV, 3D Secure</li>
          <li><strong>Descriptive billing:</strong> Clear merchant descriptors on customer statements</li>
          <li><strong>Customer communication:</strong> Setting clear expectations about billing, shipping times</li>
          <li><strong>Fraud screening tools:</strong> Implementing IP verification, geolocation checks</li>
          <li><strong>Chargeback prevention:</strong> Using alerts services that notify of disputes before they become chargebacks</li>
        </ol>
        <p>Implementing these practices can help merchants maintain lower chargeback ratios and potentially improve their terms over time.</p>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Why might a subscription business with free trials be considered high-risk?",
        options: [
          "Because free trials aren't profitable",
          "Due to potential higher chargeback rates when customers forget to cancel",
          "Because subscription billing is technically complicated",
          "Due to shipping and fulfillment challenges"
        ],
        correctAnswer: 1
      },
      {
        question: "What is a rolling reserve in high-risk merchant processing?",
        options: [
          "A loyalty program for high-volume merchants",
          "A minimum processing volume requirement",
          "A portion of transactions held by the processor as security",
          "A type of chargeback fee"
        ],
        correctAnswer: 2
      },
      {
        question: "Which document would NOT typically be required during high-risk underwriting?",
        options: [
          "Business bank statements",
          "Previous processing statements",
          "Owner's personal ID",
          "Customer satisfaction surveys"
        ],
        correctAnswer: 3
      },
      {
        question: "What is a good sales approach when discussing pricing with high-risk merchants?",
        options: [
          "Emphasize that your rates are lower than competitors",
          "Focus on account stability and reliability rather than cost",
          "Suggest they try to appear as a different business type to get lower rates",
          "Promise that rates will decrease significantly after 3 months"
        ],
        correctAnswer: 1
      },
      {
        question: "Which risk mitigation technique helps prevent chargebacks by clarifying charges on customer statements?",
        options: [
          "Rolling reserve",
          "3D Secure authentication",
          "Clear merchant descriptors",
          "Address verification"
        ],
        correctAnswer: 2
      }
    ]
  }
};

// Create an object mapping module IDs to their content
export const moduleContentMap: Record<number, ModuleContent> = {
  6: interchangeFeesModule,
  7: highRiskModule,
  // We'll implement more modules later
  8: {
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
  },
};

// Function to get module content by ID
export const getModuleContent = (id: number): ModuleContent | undefined => {
  return moduleContentMap[id];
};

// Initialize more module placeholders that we'll implement later
for (let i = 9; i <= 15; i++) {
  moduleContentMap[i] = {
    id: i,
    title: `Module ${i}`,
    description: "This module content will be implemented in the future",
    duration: "Coming soon",
    sections: [
      {
        title: "Coming Soon",
        content: "<p>The full content for this module is being developed.</p>"
      }
    ],
    quiz: {
      questions: [
        {
          question: "Sample question",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0
        }
      ]
    }
  };
}

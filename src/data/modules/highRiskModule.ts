
import { ModuleContent } from '@/components/training/ModuleDetail';

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

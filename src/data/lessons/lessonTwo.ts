
import { LessonContent } from '../types/lessons';

export const lessonTwo: LessonContent = {
  id: 2,
  title: 'The 5 Core Players in Merchant Services',
  description: 'Learn about processors, gateways, acquirers, ISOs and more',
  duration: '45 min',
  topics: [
    'Processors (Fiserv, TSYS, Elavon)',
    'Acquirers (Wells Fargo, Chase)',
    'Gateways (Authorize.net, NMI)',
    'ISOs vs. MSPs explained',
    'Where your company fits in the ecosystem'
  ],
  sections: [
    {
      title: 'Payment Processors: The Transaction Engines',
      content: `
        <p>Payment processors are the technological backbone of the payment ecosystem, handling the data transmission between merchants, card networks, and banks. Their core functions include:</p>
        <ul>
          <li><strong>Transaction Routing</strong>: Directing payment data to appropriate networks and banks</li>
          <li><strong>Security & Encryption</strong>: Safeguarding sensitive payment information</li>
          <li><strong>Fraud Detection</strong>: Employing algorithms to identify suspicious transactions</li>
          <li><strong>Reporting & Analytics</strong>: Providing merchants with transaction data and insights</li>
        </ul>
        <p>Major processors include:</p>
        <ul>
          <li><strong>Fiserv</strong> (formerly First Data): One of the largest global processors, handling millions of merchant accounts</li>
          <li><strong>TSYS</strong> (Total System Services): A major processor specializing in credit card processing and merchant acquiring</li>
          <li><strong>Elavon</strong>: A processor owned by U.S. Bank that serves businesses in various industries</li>
          <li><strong>Worldpay</strong>: A global processor processing billions of transactions annually</li>
        </ul>
        <p>Processors typically charge fees based on transaction volume and may offer various pricing models, including interchange-plus and tiered pricing.</p>
      `,
      image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/payment-processors-diagram.png'
    },
    {
      title: 'Acquirers: The Merchant\'s Financial Partner',
      content: `
        <p>Acquiring banks, or "acquirers," are financial institutions that maintain merchant accounts and enable businesses to accept card payments. Their key roles include:</p>
        <ul>
          <li><strong>Merchant Underwriting</strong>: Evaluating and approving businesses for payment processing</li>
          <li><strong>Risk Management</strong>: Monitoring transactions for fraudulent activity</li>
          <li><strong>Fund Settlement</strong>: Depositing transaction proceeds into merchant accounts</li>
          <li><strong>Chargeback Processing</strong>: Managing the dispute resolution process</li>
        </ul>
        <p>Major acquirers include:</p>
        <ul>
          <li><strong>Chase Merchant Services</strong>: A division of JPMorgan Chase serving millions of businesses</li>
          <li><strong>Bank of America Merchant Services</strong>: A leading payment processor for mid-size to large businesses</li>
          <li><strong>Wells Fargo Merchant Services</strong>: Offering processing solutions integrated with banking services</li>
          <li><strong>Elavon</strong>: Acting as both processor and acquirer in many cases</li>
        </ul>
        <p>Acquirers earn revenue through various fees, including discount rates (percentage of each transaction), authorization fees, and monthly service charges.</p>
      `,
      image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/acquiring-banks-chart.png'
    },
    {
      title: 'Payment Gateways: The Digital Doorway',
      content: `
        <p>Payment gateways are the technology that connects merchants' websites or POS systems to the payment processing networks. Think of them as the digital equivalent of a physical payment terminal. Key functions include:</p>
        <ul>
          <li><strong>Encryption</strong>: Securing customer payment information</li>
          <li><strong>Authorization Requests</strong>: Facilitating communication with issuing banks</li>
          <li><strong>Data Capture</strong>: Collecting and storing transaction information</li>
          <li><strong>Integration</strong>: Connecting with e-commerce platforms and shopping carts</li>
        </ul>
        <p>Popular gateway providers:</p>
        <ul>
          <li><strong>Authorize.Net</strong>: One of the oldest and most widely used gateways</li>
          <li><strong>NMI</strong> (Network Merchants Inc.): A comprehensive gateway offering white-label solutions</li>
          <li><strong>Stripe</strong>: A developer-friendly gateway with extensive API capabilities</li>
          <li><strong>PayPal</strong>: A gateway that doubles as a consumer payment method</li>
        </ul>
        <p>Gateways typically charge per-transaction fees, monthly service fees, and sometimes setup fees. Many modern processors offer integrated gateway services.</p>
      `,
      image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/payment-gateway-flow.png'
    },
    {
      title: 'ISOs vs. MSPs: Understanding the Difference',
      content: `
        <p>Independent Sales Organizations (ISOs) and Member Service Providers (MSPs) are critical intermediaries in the payment ecosystem:</p>
        <ul>
          <li><strong>ISO (Independent Sales Organization)</strong>: A third-party company authorized by a payment processor or acquiring bank to sell payment processing services and related products. ISOs:
            <ul>
              <li>Market and sell merchant accounts</li>
              <li>Provide customer service to merchants</li>
              <li>May offer value-added services like POS systems or online reporting tools</li>
              <li>Earn revenue through revenue sharing with processors/acquirers</li>
            </ul>
          </li>
          <li><strong>MSP (Member Service Provider)</strong>: Similar to an ISO but officially registered with card networks (usually Mastercard), allowing them to have more direct interaction with the card networks. This designation:
            <ul>
              <li>Requires meeting stricter financial and operational standards</li>
              <li>Allows direct registration with card networks</li>
              <li>Provides greater legitimacy and sometimes broader capabilities</li>
              <li>May enable additional service offerings</li>
            </ul>
          </li>
        </ul>
        <p>Key differences:</p>
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <tr style="background-color:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Feature</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">ISO</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">MSP</th>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Registration</td>
            <td style="border:1px solid #ddd; padding:8px;">With processor/acquirer</td>
            <td style="border:1px solid #ddd; padding:8px;">With processor/acquirer AND card networks</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Certification Requirements</td>
            <td style="border:1px solid #ddd; padding:8px;">Lower</td>
            <td style="border:1px solid #ddd; padding:8px;">Higher</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Brand Recognition</td>
            <td style="border:1px solid #ddd; padding:8px;">Can use own brand</td>
            <td style="border:1px solid #ddd; padding:8px;">Can use own brand + network logos</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Relationship to Processor</td>
            <td style="border:1px solid #ddd; padding:8px;">Reseller</td>
            <td style="border:1px solid #ddd; padding:8px;">Partner with direct network access</td>
          </tr>
        </table>
      `
    },
    {
      title: 'Your Company in the Ecosystem',
      content: `
        <p>Understanding where your company fits in the payment processing ecosystem is crucial for sales success:</p>
        <ul>
          <li><strong>If you're an ISO/MSP</strong>:
            <ul>
              <li>You're the primary point of contact for the merchant</li>
              <li>You sell processing services on behalf of a processor/acquirer</li>
              <li>You earn residual income from the transactions processed</li>
              <li>You may offer value-added services like equipment, POS systems, or reporting tools</li>
              <li>Your competitive advantage comes from service, support, and specialized knowledge</li>
            </ul>
          </li>
          <li><strong>If you're a direct sales agent</strong>:
            <ul>
              <li>You represent an ISO, MSP, processor, or acquirer</li>
              <li>You focus on merchant acquisition and relationship management</li>
              <li>You earn commissions or revenue shares on the accounts you bring in</li>
              <li>Your success depends on understanding merchant needs and tailoring solutions</li>
            </ul>
          </li>
        </ul>
        <p><strong>Key Value Proposition Points:</strong></p>
        <ul>
          <li>Local support and personalized service (unlike big processors)</li>
          <li>Industry-specific knowledge and tailored solutions</li>
          <li>Ability to negotiate competitive rates due to relationship with processor/acquirer</li>
          <li>One-stop shop for payment processing, equipment, and related services</li>
          <li>Ongoing support and consultation as business needs evolve</li>
        </ul>
        <p>When positioning your company, emphasize your understanding of the entire ecosystem and your ability to navigate it on behalf of the merchant, saving them time and money while providing expert guidance.</p>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Which of the following companies is primarily known as a payment processor?",
        options: ["Chase", "Fiserv", "Authorize.Net", "Square"],
        correctAnswer: 1
      },
      {
        question: "What is the main difference between an ISO and an MSP?",
        options: ["MSPs only work with online businesses", "ISOs are registered with card networks", "MSPs are registered with card networks", "There is no difference"],
        correctAnswer: 2
      },
      {
        question: "What is the primary function of a payment gateway?",
        options: [
          "To underwrite merchant accounts", 
          "To connect merchants' websites/POS systems to processing networks", 
          "To issue credit cards to consumers", 
          "To handle chargeback disputes"
        ],
        correctAnswer: 1
      },
      {
        question: "Which entity is responsible for maintaining the merchant account and enabling businesses to accept card payments?",
        options: ["Processor", "Gateway", "Acquirer", "ISO"],
        correctAnswer: 2
      },
      {
        question: "As a sales agent for an ISO, what is typically your primary source of income?",
        options: [
          "Flat salary", 
          "One-time commissions on equipment sales only", 
          "Revenue sharing or residuals from transaction processing", 
          "Hourly consulting fees"
        ],
        correctAnswer: 2
      }
    ]
  }
};

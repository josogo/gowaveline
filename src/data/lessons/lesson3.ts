
import { LessonContent } from '../types/lessonTypes';

export const lesson3: LessonContent = {
  id: 3,
  title: 'Payment Infrastructure and Technology',
  description: 'Deep dive into the technical foundation of payment processing',
  duration: '55 min',
  topics: [
    'Merchant Accounts Explained',
    'Payment Gateways In-Depth',
    'Processing Platforms and Back-End Systems',
    'Card Association Networks',
    'Data Security Infrastructure',
    'Integration Ecosystem'
  ],
  sections: [
    {
      title: 'Merchant Accounts Explained',
      content: `
        <p><strong>Definition and Purpose:</strong></p>
        <p>A merchant account is a specialized bank account that allows businesses to accept and process credit and debit card transactions. Unlike standard business accounts, merchant accounts handle the complexities of card payment acceptance, including authorization, settlement, and funding.</p>
        
        <p><strong>Types of Merchant Accounts:</strong></p>
        <ul>
          <li><strong>Traditional Merchant Accounts:</strong> Dedicated accounts with direct relationships between merchants and acquiring banks or processors</li>
          <li><strong>Aggregated Merchant Accounts:</strong> Sub-accounts under a payment service provider's (PSP) master merchant account (e.g., Square, Stripe)</li>
          <li><strong>High-Risk Merchant Accounts:</strong> Specialized accounts for industries with higher chargeback rates or regulatory complexity</li>
        </ul>
        
        <p><strong>Application and Approval Process:</strong></p>
        <ul>
          <li>Business verification and underwriting</li>
          <li>Credit assessment and risk evaluation</li>
          <li>Processing history review (for established businesses)</li>
          <li>Industry-specific compliance checks</li>
        </ul>
        
        <p><strong>Merchant Account Pricing Structures:</strong></p>
        <ul>
          <li><strong>Interchange-plus:</strong> Transparent model with interchange fees + processor markup</li>
          <li><strong>Flat-rate:</strong> Simplified fixed percentage regardless of card type</li>
          <li><strong>Tiered pricing:</strong> Transactions grouped into qualified, mid-qualified, and non-qualified rates</li>
          <li><strong>Subscription:</strong> Monthly fee plus small per-transaction fee</li>
        </ul>
      `
    },
    {
      title: 'Payment Gateways In-Depth',
      content: `
        <p><strong>Definition and Functionality:</strong></p>
        <p>A payment gateway is the technology that captures and transmits payment data between merchants, processors, and banks. It serves as the critical link connecting online storefronts or point-of-sale systems to the payment processing networks.</p>
        
        <p><strong>Gateway vs. Processor Distinctions:</strong></p>
        <table style="width:100%; border-collapse:collapse; margin:15px 0;">
          <tr style="background-color:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Payment Gateway</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Payment Processor</th>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Captures and encrypts transaction data</td>
            <td style="border:1px solid #ddd; padding:8px;">Routes transactions between networks and banks</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Customer-facing interface for payments</td>
            <td style="border:1px solid #ddd; padding:8px;">Backend settlement and funding services</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Provides developer tools and APIs</td>
            <td style="border:1px solid #ddd; padding:8px;">Manages underwriting and risk</td>
          </tr>
        </table>
        
        <p><strong>Gateway Security Features:</strong></p>
        <ul>
          <li>PCI DSS compliance frameworks</li>
          <li>Tokenization of payment data</li>
          <li>End-to-end encryption</li>
          <li>Fraud detection algorithms</li>
          <li>Velocity checking and threshold monitoring</li>
        </ul>
        
        <p><strong>Integration Methods:</strong></p>
        <ul>
          <li><strong>API Integrations:</strong> Direct code-level integration for custom solutions</li>
          <li><strong>Hosted Payment Pages:</strong> Pre-built, secure checkout pages hosted by the gateway</li>
          <li><strong>Embedded Forms:</strong> Gateway-provided components that can be styled to match merchant branding</li>
        </ul>
      `
    },
    {
      title: 'Processing Platforms and Back-End Systems',
      content: `
        <p><strong>Authorization Platforms:</strong></p>
        <ul>
          <li>Real-time processing engines</li>
          <li>Rules-based approval systems</li>
          <li>Stand-in processing capabilities</li>
          <li>Redundancy and failover systems</li>
        </ul>
        
        <p><strong>Clearing and Settlement Systems:</strong></p>
        <ul>
          <li>Batch processing infrastructure</li>
          <li>Reconciliation engines</li>
          <li>Interchange qualification optimization</li>
          <li>Cross-border settlement mechanisms</li>
        </ul>
        
        <p><strong>Reporting and Analytics Engines:</strong></p>
        <ul>
          <li>Transaction dashboards and monitoring tools</li>
          <li>Business intelligence platforms</li>
          <li>Custom report generation</li>
          <li>Data warehousing and analysis</li>
        </ul>
        
        <p><strong>Fraud Detection Mechanisms:</strong></p>
        <ul>
          <li>Machine learning algorithms</li>
          <li>Behavior analysis systems</li>
          <li>Device fingerprinting</li>
          <li>Geographic IP verification</li>
          <li>Rules-based scoring engines</li>
        </ul>
        
        <p><strong>Chargeback Management Systems:</strong></p>
        <ul>
          <li>Automated dispute notification</li>
          <li>Evidence collection platforms</li>
          <li>Response workflow management</li>
          <li>Analytics for chargeback reduction</li>
        </ul>
      `
    },
    {
      title: 'Card Association Networks',
      content: `
        <p><strong>Role and Function:</strong></p>
        <p>Card networks establish the rules, standards, and infrastructure that enable the interoperability of payment cards globally. They serve as the connection between issuing and acquiring banks while providing brand recognition and consumer confidence.</p>
        
        <p><strong>Major Networks:</strong></p>
        <ul>
          <li><strong>Visa:</strong> Largest global network by transaction volume</li>
          <li><strong>Mastercard:</strong> Second-largest global network</li>
          <li><strong>American Express:</strong> Closed-loop network (both issuer and network)</li>
          <li><strong>Discover:</strong> Proprietary network with international partnerships</li>
          <li>Regional networks (China UnionPay, JCB, etc.)</li>
        </ul>
        
        <p><strong>Network Rules and Regulations:</strong></p>
        <ul>
          <li>Acceptance requirements and guidelines</li>
          <li>Dispute resolution procedures</li>
          <li>Security standards and compliance mandates</li>
          <li>Brand usage requirements</li>
        </ul>
        
        <p><strong>Interchange Categories and Qualification:</strong></p>
        <p>Interchange rates vary based on numerous factors:</p>
        <ul>
          <li>Card type (consumer vs. commercial, rewards vs. standard)</li>
          <li>Merchant category code (MCC)</li>
          <li>Transaction type (card-present vs. card-not-present)</li>
          <li>Processing method (swiped, EMV, tokenized, key-entered)</li>
          <li>Settlement timeframe (same-day vs. standard)</li>
        </ul>
      `
    },
    {
      title: 'Data Security Infrastructure',
      content: `
        <p><strong>Encryption Methodologies:</strong></p>
        <ul>
          <li><strong>TLS/SSL:</strong> Secure transmission protocols</li>
          <li><strong>AES-256:</strong> Advanced Encryption Standard for data at rest</li>
          <li><strong>RSA:</strong> Asymmetric encryption for secure key exchange</li>
          <li><strong>DUKPT:</strong> Derived Unique Key Per Transaction for terminal security</li>
        </ul>
        
        <p><strong>Tokenization Explained:</strong></p>
        <p>Tokenization replaces sensitive card data with a non-sensitive substitute value (token) that maintains the format but has no exploitable value if compromised.</p>
        <ul>
          <li>Format-preserving tokens maintain the appearance of card data</li>
          <li>Token vaults securely store the mapping between tokens and real data</li>
          <li>Reduces PCI scope by eliminating stored card data</li>
          <li>Enables secure recurring billing without storing actual card details</li>
        </ul>
        
        <p><strong>Point-to-Point Encryption (P2PE):</strong></p>
        <ul>
          <li>Encrypts data at the point of capture (terminal/card reader)</li>
          <li>Data remains encrypted until it reaches the secure decryption environment</li>
          <li>Renders data unreadable throughout the merchant environment</li>
          <li>Significantly reduces PCI compliance scope</li>
        </ul>
        
        <p><strong>Secure Data Storage:</strong></p>
        <ul>
          <li>Data segregation practices</li>
          <li>Role-based access controls</li>
          <li>Key management systems</li>
          <li>Data retention policies</li>
          <li>Secure deletion protocols</li>
        </ul>
      `
    },
    {
      title: 'Integration Ecosystem',
      content: `
        <p><strong>Third-Party Software Integrations:</strong></p>
        <ul>
          <li>E-commerce platform plugins (Shopify, WooCommerce, Magento)</li>
          <li>Accounting software connections (QuickBooks, Xero, Sage)</li>
          <li>CRM integrations (Salesforce, HubSpot)</li>
          <li>Industry-specific software connections</li>
        </ul>
        
        <p><strong>API Development and Management:</strong></p>
        <ul>
          <li>RESTful API architectures</li>
          <li>GraphQL implementations</li>
          <li>Authentication methods (OAuth, API keys)</li>
          <li>Rate limiting and throttling</li>
          <li>Versioning strategies</li>
        </ul>
        
        <p><strong>SDK Implementations:</strong></p>
        <ul>
          <li>Mobile SDKs (iOS, Android)</li>
          <li>Web SDKs (JavaScript)</li>
          <li>Server-side libraries (PHP, Python, Java, Ruby, .NET)</li>
          <li>Cross-platform development tools</li>
        </ul>
        
        <p><strong>Webhooks and Callback Functionality:</strong></p>
        <ul>
          <li>Real-time event notifications</li>
          <li>Transaction status updates</li>
          <li>Asynchronous processing patterns</li>
          <li>Retry logic and failure handling</li>
        </ul>
        
        <p><strong>Testing and Certification:</strong></p>
        <ul>
          <li>Sandbox environments</li>
          <li>Integration test suites</li>
          <li>Certification processes</li>
          <li>Production readiness validation</li>
        </ul>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Which type of merchant account is used by services like Square and Stripe?",
        options: ["Traditional Merchant Account", "Aggregated Merchant Account", "High-Risk Merchant Account", "Virtual Merchant Account"],
        correctAnswer: 1
      },
      {
        question: "What is the main distinction between a payment gateway and a payment processor?",
        options: [
          "Gateways handle card-present transactions while processors handle online transactions", 
          "Gateways capture and encrypt transaction data while processors route transactions between networks", 
          "Processors are only used for credit cards while gateways handle all payment types",
          "Gateways are hardware devices while processors are software systems"
        ],
        correctAnswer: 1
      },
      {
        question: "What is tokenization in payment processing?",
        options: [
          "A blockchain-based payment method", 
          "The conversion of currency values between different countries", 
          "Replacing sensitive card data with a non-sensitive substitute value", 
          "The hardware encryption technique used in EMV chips"
        ],
        correctAnswer: 2
      },
      {
        question: "Which of the following is NOT a major card network mentioned in the lesson?",
        options: ["Visa", "Mastercard", "PayPal", "American Express"],
        correctAnswer: 2
      },
      {
        question: "What does P2PE stand for in payment security?",
        options: ["Processor-to-Processor Encryption", "Public-to-Private Exchange", "Point-to-Point Encryption", "Payment-to-Payer Encryption"],
        correctAnswer: 2
      }
    ]
  }
};

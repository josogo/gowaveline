
import { LessonContent } from '../types/lessonTypes';

export const lesson4: LessonContent = {
  id: 4,
  title: 'Security Compliance and Risk Management',
  description: 'Understanding payment security standards and risk mitigation strategies',
  duration: '60 min',
  topics: [
    'PCI DSS Compliance Framework',
    'Fraud Prevention and Detection',
    'Risk Management Strategies',
    'Chargeback Management',
    'Regulatory Compliance Beyond PCI',
    'Security as a Value Proposition'
  ],
  sections: [
    {
      title: 'PCI DSS Compliance Framework',
      content: `
        <p><strong>What is PCI DSS?</strong></p>
        <p>The Payment Card Industry Data Security Standard (PCI DSS) is a set of security requirements designed to ensure all companies that process, store, or transmit credit card information maintain a secure environment. Established by major card brands (Visa, Mastercard, Amex, Discover, JCB), it's mandatory for all entities handling cardholder data.</p>
        
        <p><strong>The 12 PCI DSS Requirements:</strong></p>
        <ol>
          <li><strong>Install and maintain a firewall:</strong> Configuration to protect cardholder data</li>
          <li><strong>Proper password management:</strong> Don't use vendor-supplied defaults</li>
          <li><strong>Protect stored cardholder data:</strong> Through encryption, truncation, or tokenization</li>
          <li><strong>Encrypt transmission of cardholder data:</strong> Across open, public networks</li>
          <li><strong>Use and regularly update anti-virus:</strong> Protection against malware</li>
          <li><strong>Develop and maintain secure systems:</strong> Regular patches and updates</li>
          <li><strong>Restrict access to cardholder data:</strong> Need-to-know basis only</li>
          <li><strong>Assign unique IDs:</strong> To each person with computer access</li>
          <li><strong>Restrict physical access:</strong> To cardholder data</li>
          <li><strong>Track and monitor access:</strong> To network resources and cardholder data</li>
          <li><strong>Regularly test security systems:</strong> Through penetration testing and vulnerability scans</li>
          <li><strong>Maintain an information security policy:</strong> For personnel and contractors</li>
        </ol>
        
        <p><strong>Compliance Levels:</strong></p>
        <table style="width:100%; border-collapse:collapse; margin:15px 0;">
          <tr style="background-color:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Level</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Transaction Volume</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Validation Requirements</th>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Level 1</td>
            <td style="border:1px solid #ddd; padding:8px;">Over 6 million transactions annually</td>
            <td style="border:1px solid #ddd; padding:8px;">Annual onsite assessment by QSA, quarterly network scan</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Level 2</td>
            <td style="border:1px solid #ddd; padding:8px;">1-6 million transactions annually</td>
            <td style="border:1px solid #ddd; padding:8px;">Annual self-assessment, quarterly network scan</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Level 3</td>
            <td style="border:1px solid #ddd; padding:8px;">20,000-1 million e-commerce transactions</td>
            <td style="border:1px solid #ddd; padding:8px;">Annual self-assessment, quarterly network scan</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Level 4</td>
            <td style="border:1px solid #ddd; padding:8px;">Less than 20,000 e-commerce or up to 1 million other transactions</td>
            <td style="border:1px solid #ddd; padding:8px;">Annual self-assessment questionnaire, quarterly scan may be required</td>
          </tr>
        </table>
      `
    },
    {
      title: 'Fraud Prevention and Detection',
      content: `
        <p><strong>Common Types of Payment Fraud:</strong></p>
        <ul>
          <li><strong>Card-Present Fraud:</strong>
            <ul>
              <li>Counterfeit cards (skimming)</li>
              <li>Lost or stolen cards</li>
              <li>Account takeover at POS</li>
            </ul>
          </li>
          <li><strong>Card-Not-Present Fraud:</strong>
            <ul>
              <li>Stolen card details used online</li>
              <li>Identity theft</li>
              <li>Phishing schemes</li>
            </ul>
          </li>
          <li><strong>Account Takeover Fraud:</strong>
            <ul>
              <li>Credential stuffing attacks</li>
              <li>Password reset exploitation</li>
            </ul>
          </li>
          <li><strong>Friendly Fraud:</strong>
            <ul>
              <li>Legitimate purchases disputed by customers</li>
              <li>Family member unauthorized use claims</li>
              <li>"I didn't receive it" false claims</li>
            </ul>
          </li>
        </ul>
        
        <p><strong>Fraud Detection Tools:</strong></p>
        <ul>
          <li><strong>Address Verification Service (AVS):</strong> Compares billing address with card issuer records</li>
          <li><strong>Card Verification Value (CVV):</strong> 3-4 digit code on the card not stored in magnetic stripe</li>
          <li><strong>3D Secure (3DS):</strong> Additional authentication layer for online purchases (Verified by Visa, Mastercard SecureCode)</li>
          <li><strong>Machine Learning Systems:</strong> Analyze patterns across transactions to identify anomalies</li>
          <li><strong>Device Fingerprinting:</strong> Identify devices used in transactions to detect suspicious patterns</li>
          <li><strong>Behavioral Analytics:</strong> Monitor user behavior for deviations from normal patterns</li>
        </ul>
        
        <p><strong>Fraud Prevention Best Practices:</strong></p>
        <ul>
          <li>Implement multi-layered security approaches</li>
          <li>Set transaction amount thresholds for additional verification</li>
          <li>Establish velocity checks (multiple transactions in short timeframes)</li>
          <li>Review high-risk orders manually</li>
          <li>Maintain negative databases (known fraudulent data points)</li>
          <li>Deploy geolocation filtering for unusual locations</li>
        </ul>
      `
    },
    {
      title: 'Risk Management Strategies',
      content: `
        <p><strong>Merchant Risk Assessment:</strong></p>
        <ul>
          <li><strong>Business Model Evaluation:</strong>
            <ul>
              <li>Products/services offered</li>
              <li>Sales channels (online, in-store, MOTO)</li>
              <li>Delivery timeframes</li>
              <li>Recurring billing models</li>
            </ul>
          </li>
          <li><strong>Financial Assessment:</strong>
            <ul>
              <li>Credit history and financial stability</li>
              <li>Processing history</li>
              <li>Projected transaction volumes</li>
              <li>Average ticket size</li>
            </ul>
          </li>
          <li><strong>Industry Risk Factors:</strong>
            <ul>
              <li>Chargeback history by vertical</li>
              <li>Regulatory compliance requirements</li>
              <li>Seasonal fluctuations</li>
              <li>Industry reputation</li>
            </ul>
          </li>
        </ul>
        
        <p><strong>Transaction Monitoring:</strong></p>
        <ul>
          <li>Real-time transaction screening</li>
          <li>Customizable rule sets</li>
          <li>Score-based risk assessment</li>
          <li>Manual review queues for flagged transactions</li>
          <li>Post-transaction analysis</li>
        </ul>
        
        <p><strong>Velocity Checking and Limits:</strong></p>
        <ul>
          <li>Maximum transaction amount thresholds</li>
          <li>Daily/weekly/monthly processing caps</li>
          <li>Transaction count limits within timeframes</li>
          <li>Card usage frequency restrictions</li>
          <li>New merchant gradual processing increases</li>
        </ul>
        
        <p><strong>High-Risk Merchant Management:</strong></p>
        <ul>
          <li>Enhanced due diligence procedures</li>
          <li>Reserve requirements (rolling, fixed, up-front)</li>
          <li>Accelerated settlement timelines</li>
          <li>More frequent statement reconciliation</li>
          <li>Regular compliance reviews</li>
        </ul>
      `
    },
    {
      title: 'Chargeback Management',
      content: `
        <p><strong>The Chargeback Lifecycle:</strong></p>
        <ol>
          <li><strong>First Presentment:</strong> Original transaction is processed</li>
          <li><strong>Dispute Initiation:</strong> Cardholder contacts issuing bank</li>
          <li><strong>Chargeback Filed:</strong> Issuer sends chargeback to acquirer</li>
          <li><strong>Merchant Notification:</strong> Acquirer notifies merchant of chargeback</li>
          <li><strong>Representment:</strong> Merchant submits evidence to fight chargeback</li>
          <li><strong>Second Presentment:</strong> Acquirer sends evidence to issuer</li>
          <li><strong>Issuer Review:</strong> Decision to accept or reject representment</li>
          <li><strong>Pre-Arbitration:</strong> Further dispute if necessary</li>
          <li><strong>Arbitration:</strong> Card network makes final ruling</li>
        </ol>
        
        <p><strong>Common Chargeback Reason Codes:</strong></p>
        <table style="width:100%; border-collapse:collapse; margin:15px 0;">
          <tr style="background-color:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Category</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Common Codes</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Description</th>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Fraud</td>
            <td style="border:1px solid #ddd; padding:8px;">10.4, 10.5 (Visa); 4837 (Mastercard)</td>
            <td style="border:1px solid #ddd; padding:8px;">Cardholder claims they didn't authorize transaction</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Product/Service Issues</td>
            <td style="border:1px solid #ddd; padding:8px;">13.1, 13.2 (Visa); 4853 (Mastercard)</td>
            <td style="border:1px solid #ddd; padding:8px;">Item not received or doesn't match description</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Processing Errors</td>
            <td style="border:1px solid #ddd; padding:8px;">12.1, 12.2 (Visa); 4834 (Mastercard)</td>
            <td style="border:1px solid #ddd; padding:8px;">Duplicate processing or incorrect amount</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Consumer Disputes</td>
            <td style="border:1px solid #ddd; padding:8px;">13.6, 13.7 (Visa); 4855 (Mastercard)</td>
            <td style="border:1px solid #ddd; padding:8px;">Canceled recurring billing or credit not processed</td>
          </tr>
        </table>
        
        <p><strong>Prevention Strategies:</strong></p>
        <ul>
          <li>Clear merchant name on billing statements</li>
          <li>Transparent refund and return policies</li>
          <li>Delivery confirmation for physical goods</li>
          <li>Detailed transaction receipts</li>
          <li>Responsive customer service</li>
          <li>Clear communication about recurring billing</li>
        </ul>
        
        <p><strong>Chargeback Management Programs:</strong></p>
        <ul>
          <li>Visa Dispute Resolution (VDR)</li>
          <li>Mastercard Dispute Administration (MDA)</li>
          <li>Early warning alert systems</li>
          <li>Pre-chargeback notification services</li>
          <li>Automated evidence submission</li>
        </ul>
      `
    },
    {
      title: 'Regulatory Compliance Beyond PCI',
      content: `
        <p><strong>Anti-Money Laundering (AML) Requirements:</strong></p>
        <ul>
          <li>Bank Secrecy Act compliance</li>
          <li>Customer identification programs</li>
          <li>Transaction monitoring for suspicious activity</li>
          <li>Currency Transaction Reports (CTRs)</li>
          <li>Suspicious Activity Reports (SARs)</li>
        </ul>
        
        <p><strong>Know Your Customer (KYC) Procedures:</strong></p>
        <ul>
          <li>Identity verification requirements</li>
          <li>Beneficial ownership identification</li>
          <li>Risk-based due diligence</li>
          <li>Ongoing monitoring obligations</li>
        </ul>
        
        <p><strong>Data Privacy Regulations:</strong></p>
        <ul>
          <li><strong>GDPR (General Data Protection Regulation):</strong>
            <ul>
              <li>Consent requirements for data collection</li>
              <li>Right to be forgotten</li>
              <li>Data breach notification requirements</li>
              <li>Data minimization principles</li>
            </ul>
          </li>
          <li><strong>CCPA/CPRA (California Consumer Privacy Act/California Privacy Rights Act):</strong>
            <ul>
              <li>Consumer rights to access collected data</li>
              <li>Opt-out options for data sharing</li>
              <li>Data deletion requirements</li>
            </ul>
          </li>
        </ul>
        
        <p><strong>Industry-Specific Compliance:</strong></p>
        <ul>
          <li><strong>HIPAA (Healthcare):</strong>
            <ul>
              <li>Payment processing with PHI protection</li>
              <li>Business Associate Agreements</li>
              <li>Secure patient payment portals</li>
            </ul>
          </li>
          <li><strong>FERPA (Education):</strong>
            <ul>
              <li>Student data protection in payment systems</li>
              <li>Parent/guardian access controls</li>
            </ul>
          </li>
          <li><strong>Other Sectors:</strong>
            <ul>
              <li>Gaming/gambling compliance</li>
              <li>Cryptocurrency regulations</li>
              <li>Adult content restrictions</li>
              <li>Cannabis payment compliance</li>
            </ul>
          </li>
        </ul>
      `
    },
    {
      title: 'Security as a Value Proposition',
      content: `
        <p><strong>Positioning Security Features:</strong></p>
        <ul>
          <li>Highlight liability reduction benefits</li>
          <li>Emphasize customer trust enhancement</li>
          <li>Demonstrate breach cost avoidance</li>
          <li>Showcase fraud reduction capabilities</li>
        </ul>
        
        <p><strong>Educating Merchants:</strong></p>
        <ul>
          <li>Simplify complex compliance requirements</li>
          <li>Provide clear, actionable guidance</li>
          <li>Offer compliance assistance resources</li>
          <li>Create educational content (guides, webinars)</li>
        </ul>
        
        <p><strong>Security ROI Calculations:</strong></p>
        <ul>
          <li>Cost of non-compliance penalties</li>
          <li>Potential data breach expenses</li>
          <li>Customer retention value</li>
          <li>Reduced fraud loss calculations</li>
          <li>Operational efficiency improvements</li>
        </ul>
        
        <p><strong>Competitive Differentiation:</strong></p>
        <ul>
          <li>Advanced fraud prevention algorithms</li>
          <li>P2PE certification offerings</li>
          <li>Tokenization capabilities</li>
          <li>Multi-factor authentication options</li>
          <li>Compliance guarantee programs</li>
        </ul>
        
        <p><strong>Future Security Trends:</strong></p>
        <ul>
          <li>Biometric authentication advancement</li>
          <li>AI-driven fraud detection</li>
          <li>Blockchain for secure transactions</li>
          <li>Zero-knowledge proof systems</li>
          <li>Quantum-resistant cryptography</li>
        </ul>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "How many key requirements are in the PCI DSS framework?",
        options: ["6", "8", "10", "12"],
        correctAnswer: 3
      },
      {
        question: "Which of the following is NOT a common type of payment fraud mentioned in the lesson?",
        options: ["Card-present fraud", "Friendly fraud", "Account takeover fraud", "Settlement fraud"],
        correctAnswer: 3
      },
      {
        question: "What does the 'V' in AVS stand for?",
        options: ["Virtual", "Value", "Verification", "Validation"],
        correctAnswer: 2
      },
      {
        question: "According to the chargeback lifecycle, what happens immediately after a chargeback is filed?",
        options: [
          "Representment", 
          "Merchant notification", 
          "Issuer review", 
          "Arbitration"
        ],
        correctAnswer: 1
      },
      {
        question: "Which regulation specifically addresses healthcare payment compliance?",
        options: ["GDPR", "HIPAA", "FERPA", "CCPA"],
        correctAnswer: 1
      }
    ]
  }
};


import { LessonContent } from '../types/lessonTypes';

export const lesson2: LessonContent = {
  id: 2,
  title: 'Merchant Services Products and Solutions',
  description: 'Comprehensive overview of payment processing products and services',
  duration: '50 min',
  topics: [
    'Core Payment Processing Services',
    'Hardware Solutions',
    'Software and E-commerce Solutions',
    'Business Management Add-ons',
    'Vertical-Specific Solutions',
    'Solution Selection Framework'
  ],
  sections: [
    {
      title: 'Core Payment Processing Services',
      content: `
        <p><strong>Credit and Debit Card Processing:</strong></p>
        <ul>
          <li>Standard credit card processing (Visa, Mastercard, Discover, Amex)</li>
          <li>PIN debit and signature debit transaction handling</li>
          <li>Card-present and card-not-present capabilities</li>
          <li>Fleet card and specialized card processing</li>
        </ul>
        
        <p><strong>ACH and Electronic Check Processing:</strong></p>
        <ul>
          <li>Direct bank account debits and credits</li>
          <li>Recurring ACH payment scheduling</li>
          <li>Check conversion and Check 21 services</li>
          <li>Return handling and verification services</li>
        </ul>
        
        <p><strong>Alternative Payment Methods:</strong></p>
        <ul>
          <li><strong>Digital Wallets:</strong> Apple Pay, Google Pay, Samsung Pay</li>
          <li><strong>Buy Now, Pay Later (BNPL):</strong> Affirm, Klarna, Afterpay integration</li>
          <li><strong>Cryptocurrency:</strong> Bitcoin, Ethereum, and stablecoin payment options</li>
          <li><strong>P2P Transfers:</strong> Venmo, Zelle, CashApp integration options</li>
        </ul>
      `
    },
    {
      title: 'Hardware Solutions',
      content: `
        <p><strong>Traditional Credit Card Terminals:</strong></p>
        <ul>
          <li>Countertop terminals with EMV, NFC, and magstripe</li>
          <li>Wireless terminals for mobile businesses</li>
          <li>PIN pads and customer-facing displays</li>
        </ul>
        
        <p><strong>Point-of-Sale (POS) Systems:</strong></p>
        <ul>
          <li><strong>Traditional POS:</strong> Full countertop systems with cash drawers, receipt printers</li>
          <li><strong>Mobile POS (mPOS):</strong> Smartphone/tablet attachments for card acceptance</li>
          <li><strong>Cloud-based POS:</strong> Internet-connected systems with remote management</li>
        </ul>
        
        <p><strong>Payment Peripherals:</strong></p>
        <ul>
          <li>Barcode scanners and inventory trackers</li>
          <li>Cash drawers and receipt printers</li>
          <li>Customer-facing displays and kiosks</li>
        </ul>
        
        <p><strong>NFC and Contactless Solutions:</strong></p>
        <ul>
          <li>Tap-to-pay enabled devices</li>
          <li>QR code generators and scanners</li>
          <li>Wearable payment acceptance technology</li>
        </ul>
      `
    },
    {
      title: 'Software and E-commerce Solutions',
      content: `
        <p><strong>Payment Gateways:</strong></p>
        <ul>
          <li>Secure transaction routing between merchants and processors</li>
          <li>API-based integration options for developers</li>
          <li>Hosted payment pages for quick implementation</li>
          <li>Tokenization and encryption services</li>
        </ul>
        
        <p><strong>Virtual Terminals:</strong></p>
        <ul>
          <li>Web-based interfaces for manually entering transactions</li>
          <li>Customer database and payment storage</li>
          <li>Recurring billing configuration</li>
          <li>Multi-user access with permission levels</li>
        </ul>
        
        <p><strong>E-commerce Integrations:</strong></p>
        <ul>
          <li>Shopping cart plugins (WooCommerce, Shopify, Magento)</li>
          <li>Customizable checkout experiences</li>
          <li>Mobile-optimized payment pages</li>
          <li>Cross-border and multi-currency support</li>
        </ul>
        
        <p><strong>Recurring Billing Platforms:</strong></p>
        <ul>
          <li>Subscription management tools</li>
          <li>Dunning management for failed payments</li>
          <li>Flexible billing schedules and payment plans</li>
          <li>Customer self-service payment portals</li>
        </ul>
      `
    },
    {
      title: 'Business Management Add-ons',
      content: `
        <p><strong>Inventory Management:</strong></p>
        <ul>
          <li>Real-time stock tracking</li>
          <li>Auto-reordering capabilities</li>
          <li>Product variant management</li>
          <li>Supplier relationship tools</li>
        </ul>
        
        <p><strong>Customer Relationship Management:</strong></p>
        <ul>
          <li>Customer purchase history tracking</li>
          <li>Communication tools and marketing automation</li>
          <li>Loyalty program management</li>
          <li>Customer feedback collection</li>
        </ul>
        
        <p><strong>Analytics and Reporting:</strong></p>
        <ul>
          <li>Sales performance dashboards</li>
          <li>Inventory turnover analysis</li>
          <li>Employee performance tracking</li>
          <li>Custom report generation</li>
        </ul>
        
        <p><strong>Gift Card and Loyalty Programs:</strong></p>
        <ul>
          <li>Digital and physical gift card issuance</li>
          <li>Points-based loyalty systems</li>
          <li>Promotional and discount management</li>
          <li>Customer engagement tools</li>
        </ul>
        
        <p><strong>Employee Management:</strong></p>
        <ul>
          <li>Time clock and scheduling tools</li>
          <li>Role-based permissions</li>
          <li>Commission calculation</li>
          <li>Performance analytics</li>
        </ul>
      `
    },
    {
      title: 'Vertical-Specific Solutions',
      content: `
        <p><strong>Retail Solutions:</strong></p>
        <ul>
          <li>Barcode scanning and inventory integration</li>
          <li>Multi-location management</li>
          <li>Product catalog tools</li>
          <li>Returns and exchange processing</li>
        </ul>
        
        <p><strong>Restaurant and Hospitality:</strong></p>
        <ul>
          <li>Table management and reservations</li>
          <li>Split check and tip adjustment features</li>
          <li>Kitchen display systems</li>
          <li>Online ordering integration</li>
        </ul>
        
        <p><strong>Healthcare Payment Systems:</strong></p>
        <ul>
          <li>HIPAA-compliant payment processing</li>
          <li>Insurance eligibility verification</li>
          <li>Patient payment plans</li>
          <li>FSA/HSA card acceptance</li>
        </ul>
        
        <p><strong>Service-Based Business Tools:</strong></p>
        <ul>
          <li>Appointment scheduling</li>
          <li>Digital invoicing</li>
          <li>Mobile payment acceptance</li>
          <li>Service contract management</li>
        </ul>
        
        <p><strong>B2B Payment Processing:</strong></p>
        <ul>
          <li>Level 2/3 data processing for reduced interchange</li>
          <li>Purchase order matching</li>
          <li>Terms-based payment options</li>
          <li>Vendor payment automation</li>
        </ul>
      `
    },
    {
      title: 'Solution Selection Framework',
      content: `
        <p><strong>Decision Criteria for Different Business Types:</strong></p>
        <ul>
          <li>Transaction volume and average ticket size</li>
          <li>Card-present vs. card-not-present ratio</li>
          <li>Industry-specific requirements</li>
          <li>Growth projections and scalability needs</li>
          <li>Technical capabilities and support requirements</li>
        </ul>
        
        <p><strong>Matching Solutions to Business Needs:</strong></p>
        <table style="width:100%; border-collapse:collapse; margin:15px 0;">
          <tr style="background-color:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Business Type</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Priority Needs</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Recommended Solution</th>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Micro-merchant</td>
            <td style="border:1px solid #ddd; padding:8px;">Low cost, simplicity</td>
            <td style="border:1px solid #ddd; padding:8px;">Mobile card reader, flat-rate pricing</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Growing retailer</td>
            <td style="border:1px solid #ddd; padding:8px;">Inventory, multi-employee</td>
            <td style="border:1px solid #ddd; padding:8px;">Full POS, interchange-plus pricing</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Omnichannel business</td>
            <td style="border:1px solid #ddd; padding:8px;">Unified commerce</td>
            <td style="border:1px solid #ddd; padding:8px;">Integrated POS/ecommerce platform</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Enterprise</td>
            <td style="border:1px solid #ddd; padding:8px;">Custom integration, security</td>
            <td style="border:1px solid #ddd; padding:8px;">Full payment gateway, dedicated MID</td>
          </tr>
        </table>
        
        <p><strong>Integration Considerations:</strong></p>
        <ul>
          <li>Compatibility with existing business systems</li>
          <li>API availability and documentation</li>
          <li>Developer resources required</li>
          <li>Data migration process</li>
        </ul>
        
        <p><strong>Scalability Factors:</strong></p>
        <ul>
          <li>Processing volume limitations</li>
          <li>Multi-location expansion capabilities</li>
          <li>International payment acceptance</li>
          <li>Additional feature availability</li>
        </ul>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Which of the following is NOT an alternative payment method mentioned in the lesson?",
        options: ["Digital Wallets", "Cryptocurrency", "Buy Now, Pay Later", "Money Orders"],
        correctAnswer: 3
      },
      {
        question: "What feature would be most essential for a healthcare payment system?",
        options: ["Split check functionality", "HIPAA compliance", "Barcode scanning", "Reservation management"],
        correctAnswer: 1
      },
      {
        question: "Which pricing model is recommended for micro-merchants in the solution selection framework?",
        options: ["Interchange-plus", "Flat-rate", "Tiered pricing", "Monthly subscription"],
        correctAnswer: 1
      },
      {
        question: "Which of the following is a function of a payment gateway?",
        options: ["Managing physical inventory", "Printing paper receipts", "Secure routing of transactions", "Employee scheduling"],
        correctAnswer: 2
      },
      {
        question: "What type of POS system would best suit a food truck business?",
        options: ["Traditional countertop POS", "Cloud-based POS", "Mobile POS (mPOS)", "Self-checkout kiosk"],
        correctAnswer: 2
      }
    ]
  }
};

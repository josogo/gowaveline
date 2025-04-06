
import { LessonContent } from '../types/lessons';

export const lessonFive: LessonContent = {
  id: 5,
  title: 'Merchant Services Products and Solutions',
  description: 'Comprehensive overview of payment processing products and services',
  duration: '45 min',
  topics: [
    'Core Payment Processing Services',
    'Hardware Solutions',
    'Software and E-commerce Solutions',
    'Business Management Add-ons',
    'Vertical-Specific Solutions'
  ],
  sections: [
    {
      title: 'Core Payment Processing Services',
      content: `
        <p>The foundation of merchant services begins with core payment processing capabilities:</p>
        
        <h3>Credit and Debit Card Processing</h3>
        <ul>
          <li><strong>Card brands:</strong> Visa, Mastercard, American Express, Discover</li>
          <li><strong>Card types:</strong> Consumer, business, purchasing, rewards, fleet</li>
          <li><strong>Transaction types:</strong> Sales, refunds, voids, pre-authorizations</li>
          <li><strong>Processing methods:</strong> Real-time, batch, recurring</li>
        </ul>
        
        <h3>ACH and Electronic Check Processing</h3>
        <ul>
          <li><strong>Direct bank account debits:</strong> Using account and routing numbers</li>
          <li><strong>Check21 processing:</strong> Converting paper checks to electronic payments</li>
          <li><strong>Recurring ACH:</strong> For subscriptions and installment payments</li>
          <li><strong>Benefits:</strong> Lower fees than cards, good for high-ticket items</li>
        </ul>
        
        <h3>Alternative Payment Methods</h3>
        <ul>
          <li><strong>Digital wallets:</strong> Apple Pay, Google Pay, Samsung Pay
            <ul>
              <li>Mobile phone-based payments using NFC technology</li>
              <li>Enhanced security through tokenization</li>
              <li>Growing consumer adoption (40%+ of consumers)</li>
            </ul>
          </li>
          <li><strong>Buy Now, Pay Later (BNPL):</strong> Affirm, Klarna, Afterpay
            <ul>
              <li>Installment payment options at checkout</li>
              <li>Typically interest-free for consumers</li>
              <li>Higher approval rates than traditional credit</li>
              <li>Popular with younger demographics</li>
            </ul>
          </li>
          <li><strong>Cryptocurrency:</strong> Bitcoin, Ethereum, etc.
            <ul>
              <li>Emerging payment method with niche adoption</li>
              <li>Requires specialized processing solutions</li>
              <li>Potential benefits: lower fees, no chargebacks</li>
              <li>Challenges: price volatility, regulatory uncertainty</li>
            </ul>
          </li>
        </ul>
      `
    },
    {
      title: 'Hardware Solutions',
      content: `
        <p>Physical payment acceptance devices form a critical component of merchant services offerings:</p>
        
        <h3>Traditional Credit Card Terminals</h3>
        <ul>
          <li><strong>Countertop terminals:</strong> Standard fixed-location devices</li>
          <li><strong>Wireless terminals:</strong> Bluetooth or cellular-connected for mobility</li>
          <li><strong>Key features:</strong>
            <ul>
              <li>EMV chip card readers</li>
              <li>Contactless/NFC capability</li>
              <li>PIN pad for debit transactions</li>
              <li>Receipt printing</li>
              <li>Multiple connectivity options (Ethernet, Wi-Fi, cellular)</li>
            </ul>
          </li>
          <li><strong>Popular models:</strong> Verifone Engage, Ingenico Desk/Move series, Dejavoo Z-Series</li>
        </ul>
        
        <h3>Point-of-Sale (POS) Systems</h3>
        <ul>
          <li><strong>Traditional POS:</strong>
            <ul>
              <li>Full-featured systems with dedicated hardware</li>
              <li>Cash drawer, receipt printer, barcode scanner integration</li>
              <li>Industry-specific features and reporting</li>
              <li>Examples: Oracle Micros, NCR Counterpoint, Lightspeed</li>
            </ul>
          </li>
          <li><strong>Mobile POS (mPOS):</strong>
            <ul>
              <li>Smartphone/tablet-based systems with card readers</li>
              <li>Greater portability and lower startup costs</li>
              <li>Good for small businesses and mobile merchants</li>
              <li>Examples: Square, PayPal Here, Clover Go</li>
            </ul>
          </li>
          <li><strong>Cloud-based POS:</strong>
            <ul>
              <li>Modern systems with centralized data management</li>
              <li>Real-time reporting and multi-location capabilities</li>
              <li>Automatic updates and feature additions</li>
              <li>Examples: Toast, Shopify POS, Lightspeed Cloud</li>
            </ul>
          </li>
        </ul>
        
        <h3>Payment Peripherals and Accessories</h3>
        <ul>
          <li>Cash drawers and till management systems</li>
          <li>Customer-facing displays</li>
          <li>Receipt printers (thermal, impact)</li>
          <li>Barcode scanners and inventory management tools</li>
          <li>Self-checkout kiosks</li>
        </ul>
        
        <h3>NFC and Contactless Payment Devices</h3>
        <ul>
          <li>Dedicated contactless readers</li>
          <li>QR code scanning systems</li>
          <li>"Tap to pay" functionality</li>
          <li>Mobile device readers (Apple's Tap to Pay)</li>
        </ul>
      `
    },
    {
      title: 'Software and E-commerce Solutions',
      content: `
        <p>Digital payment solutions have become increasingly important in today's commerce landscape:</p>
        
        <h3>Payment Gateways</h3>
        <ul>
          <li><strong>Function:</strong> Process online credit card transactions securely</li>
          <li><strong>Importance:</strong>
            <ul>
              <li>Critical for e-commerce and online payments</li>
              <li>Provides secure transmission of sensitive data</li>
              <li>Offers fraud prevention tools</li>
              <li>Enables omnichannel commerce (same processing solution across channels)</li>
            </ul>
          </li>
          <li><strong>Integration options:</strong>
            <ul>
              <li><strong>API integration:</strong> Direct connection to websites/applications</li>
              <li><strong>Hosted payment pages:</strong> Redirect to gateway-hosted checkout</li>
              <li><strong>Embedded forms:</strong> Gateway-provided components for checkout pages</li>
            </ul>
          </li>
          <li><strong>Leading providers:</strong> Authorize.Net, Stripe, NMI, Braintree, Adyen</li>
        </ul>
        
        <h3>Virtual Terminals</h3>
        <ul>
          <li>Web-based interfaces for manually entering card transactions</li>
          <li>Ideal for phone orders, mail orders, and back-office processing</li>
          <li>Features often include:
            <ul>
              <li>Recurring billing setup</li>
              <li>Customer database management</li>
              <li>Level II/III data input for B2B transactions</li>
              <li>Invoice generation and delivery</li>
            </ul>
          </li>
        </ul>
        
        <h3>E-commerce Shopping Cart Integrations</h3>
        <ul>
          <li><strong>Ready-made connectors for popular platforms:</strong>
            <ul>
              <li>Shopify</li>
              <li>WooCommerce</li>
              <li>Magento</li>
              <li>BigCommerce</li>
              <li>Wix</li>
              <li>Squarespace</li>
            </ul>
          </li>
          <li><strong>Features to highlight:</strong>
            <ul>
              <li>One-click installation</li>
              <li>Automatic updates</li>
              <li>Inventory synchronization</li>
              <li>Order management</li>
              <li>Abandoned cart recovery</li>
            </ul>
          </li>
        </ul>
        
        <h3>Online Payment Pages and Checkout Solutions</h3>
        <ul>
          <li>Hosted payment forms for simple integration</li>
          <li>"Pay now" links and buttons for invoices and emails</li>
          <li>Customizable checkout experiences</li>
          <li>Mobile-optimized designs</li>
        </ul>
        
        <h3>Recurring Billing Platforms</h3>
        <ul>
          <li>Subscription management systems</li>
          <li>Customer portal for subscription management</li>
          <li>Automated retry logic for failed payments</li>
          <li>Dunning management (communication about payment issues)</li>
          <li>Reporting and analytics for recurring revenue</li>
        </ul>
      `
    },
    {
      title: 'Business Management Add-ons',
      content: `
        <p>Modern merchant services go beyond payment processing to offer valuable business tools:</p>
        
        <h3>Inventory Management Integration</h3>
        <ul>
          <li>Real-time inventory tracking and adjustments</li>
          <li>Automatic reorder notifications</li>
          <li>Multi-location inventory visibility</li>
          <li>Barcode scanning and product lookup</li>
          <li>Purchase order generation and tracking</li>
          <li>Vendor management capabilities</li>
        </ul>
        
        <h3>Customer Relationship Management (CRM) Tools</h3>
        <ul>
          <li>Customer database with purchase history</li>
          <li>Contact information capture and management</li>
          <li>Purchase behavior tracking and analytics</li>
          <li>Customer segmentation capabilities</li>
          <li>Marketing automation integrations</li>
          <li>Customer feedback collection</li>
        </ul>
        
        <h3>Analytics and Reporting Capabilities</h3>
        <ul>
          <li><strong>Sales reporting:</strong>
            <ul>
              <li>Daily/weekly/monthly transaction summaries</li>
              <li>Product performance metrics</li>
              <li>Sales by employee, location, or department</li>
              <li>Average ticket size and transaction count</li>
            </ul>
          </li>
          <li><strong>Financial reporting:</strong>
            <ul>
              <li>Processing fee analysis</li>
              <li>Tax collection and reporting</li>
              <li>Revenue forecasting</li>
              <li>Cash flow management</li>
            </ul>
          </li>
          <li><strong>Customer analytics:</strong>
            <ul>
              <li>New vs. returning customer metrics</li>
              <li>Customer lifetime value calculations</li>
              <li>Churn and retention analysis</li>
            </ul>
          </li>
        </ul>
        
        <h3>Gift Card and Loyalty Programs</h3>
        <ul>
          <li><strong>Gift card capabilities:</strong>
            <ul>
              <li>Physical and digital gift cards</li>
              <li>Custom branded designs</li>
              <li>Balance checking and management</li>
              <li>Reload functionality</li>
            </ul>
          </li>
          <li><strong>Loyalty programs:</strong>
            <ul>
              <li>Points-based systems</li>
              <li>Visit frequency rewards</li>
              <li>Tiered membership levels</li>
              <li>Customer mobile apps</li>
              <li>Automated communications</li>
            </ul>
          </li>
        </ul>
        
        <h3>Employee Management Features</h3>
        <ul>
          <li>Time clock and scheduling</li>
          <li>Employee performance tracking</li>
          <li>Commission calculation and reporting</li>
          <li>Permissions and security controls</li>
          <li>Training and onboarding tools</li>
        </ul>
      `
    },
    {
      title: 'Vertical-Specific Solutions',
      content: `
        <p>Different industries have unique payment processing needs that require specialized solutions:</p>
        
        <h3>Retail-Specific Payment Solutions</h3>
        <ul>
          <li><strong>Key features:</strong>
            <ul>
              <li>Inventory management with variants (size, color, etc.)</li>
              <li>Barcode scanning and generation</li>
              <li>Customer purchase history</li>
              <li>Discount and promotion management</li>
              <li>Returns and exchanges processing</li>
            </ul>
          </li>
          <li><strong>Hardware requirements:</strong> Countertop terminals or integrated POS with barcode scanners and receipt printers</li>
          <li><strong>Specialized providers:</strong> Lightspeed Retail, Vend, Shopify POS, Square for Retail</li>
        </ul>
        
        <h3>Restaurant and Hospitality Payment Systems</h3>
        <ul>
          <li><strong>Key features:</strong>
            <ul>
              <li>Table management and floor plans</li>
              <li>Split checks and partial payments</li>
              <li>Tip adjustment and distribution</li>
              <li>Kitchen display systems</li>
              <li>Online ordering integration</li>
              <li>Reservation management</li>
            </ul>
          </li>
          <li><strong>Hardware requirements:</strong> Tableside payment devices, kitchen printers, customer-facing displays</li>
          <li><strong>Specialized providers:</strong> Toast, TouchBistro, Square for Restaurants, Clover for Restaurants</li>
        </ul>
        
        <h3>Healthcare Payment Compliance Solutions</h3>
        <ul>
          <li><strong>Key features:</strong>
            <ul>
              <li>HIPAA-compliant payment processing</li>
              <li>Patient payment plans</li>
              <li>Insurance eligibility verification</li>
              <li>Flexible spending account (FSA) acceptance</li>
              <li>Secure patient information handling</li>
            </ul>
          </li>
          <li><strong>Compliance considerations:</strong> PHI protection, data security, transaction documentation</li>
          <li><strong>Specialized providers:</strong> Rectangle Health, InstaMed, Waystar, PayGov</li>
        </ul>
        
        <h3>Service-Based Business Tools</h3>
        <ul>
          <li><strong>Key features:</strong>
            <ul>
              <li>Appointment scheduling and booking</li>
              <li>Client management databases</li>
              <li>Digital invoicing and estimates</li>
              <li>Mobile and remote payment collection</li>
              <li>Recurring billing for memberships</li>
            </ul>
          </li>
          <li><strong>Business types:</strong> Salons, spas, home services, professional services</li>
          <li><strong>Specialized providers:</strong> Square Appointments, Vagaro, ServiceTitan, Jobber</li>
        </ul>
        
        <h3>B2B Payment Processing Considerations</h3>
        <ul>
          <li><strong>Key features:</strong>
            <ul>
              <li>Level II/III data capture for reduced interchange</li>
              <li>Purchase order matching and tracking</li>
              <li>Account receivable automation</li>
              <li>Virtual card acceptance</li>
              <li>Terms-based payment options</li>
            </ul>
          </li>
          <li><strong>Cost reduction strategies:</strong> Proper business card classification, data enhancement, interchange optimization</li>
          <li><strong>Specialized providers:</strong> Melio, Bill.com, AvidXchange, Billd</li>
        </ul>
      `
    },
    {
      title: 'Solution Selection Framework',
      content: `
        <p>Helping merchants select the right payment solutions requires a systematic approach:</p>
        
        <h3>Decision Criteria for Different Business Types</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <tr style="background-color:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Business Type</th>
            <th style="border:1px solid #ddd; padding:8px; text-align:left;">Primary Considerations</th>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">New/Startup Business</td>
            <td style="border:1px solid #ddd; padding:8px;">
              <ul>
                <li>Low upfront costs</li>
                <li>Easy setup and configuration</li>
                <li>Flexibility to scale</li>
                <li>Simple, predictable pricing</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Established Retail</td>
            <td style="border:1px solid #ddd; padding:8px;">
              <ul>
                <li>Robust inventory management</li>
                <li>High transaction throughput</li>
                <li>Advanced reporting</li>
                <li>Competitive processing rates</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">E-commerce</td>
            <td style="border:1px solid #ddd; padding:8px;">
              <ul>
                <li>Shopping cart integration</li>
                <li>Fraud prevention tools</li>
                <li>Mobile-optimized checkout</li>
                <li>International payment options</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Restaurant</td>
            <td style="border:1px solid #ddd; padding:8px;">
              <ul>
                <li>Tableside payment</li>
                <li>Tip management</li>
                <li>Split check functionality</li>
                <li>Online ordering integration</li>
              </ul>
            </td>
          </tr>
        </table>
        
        <h3>Matching Solutions to Business Needs and Volumes</h3>
        <ul>
          <li><strong>Transaction volume considerations:</strong>
            <ul>
              <li>Low volume (< $5,000/month): Simplified flat-rate solutions</li>
              <li>Medium volume ($5,000-$20,000/month): Interchange-plus pricing, standard POS</li>
              <li>High volume ($20,000+/month): Custom interchange-plus rates, advanced POS, dedicated account management</li>
            </ul>
          </li>
          <li><strong>Average ticket size impact:</strong>
            <ul>
              <li>Low ticket (< $10): Fixed transaction fee minimization</li>
              <li>Medium ticket ($10-$100): Balanced rate and fee structure</li>
              <li>High ticket ($100+): Percentage rate optimization, subscription pricing</li>
            </ul>
          </li>
        </ul>
        
        <h3>Integration Considerations with Existing Systems</h3>
        <ul>
          <li>Current accounting software compatibility</li>
          <li>ERP or CRM system integration requirements</li>
          <li>E-commerce platform compatibility</li>
          <li>API availability and documentation</li>
          <li>Technical support for integration assistance</li>
        </ul>
        
        <h3>Scalability Factors for Growing Businesses</h3>
        <ul>
          <li>Multi-location capabilities</li>
          <li>User permission and role management</li>
          <li>Transaction volume capacity</li>
          <li>Additional feature availability</li>
          <li>Pricing structure as volume increases</li>
          <li>International expansion support</li>
        </ul>
        <p>By carefully evaluating these factors, payment professionals can recommend solutions that not only meet the merchant's current needs but also support their future growth and evolution.</p>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Which payment method typically offers the benefit of no chargebacks?",
        options: ["Credit cards", "Debit cards", "ACH payments", "Mobile wallets"],
        correctAnswer: 2
      },
      {
        question: "What is a key advantage of cloud-based POS systems over traditional POS systems?",
        options: [
          "Lower processing fees", 
          "Faster transaction speeds", 
          "Real-time reporting and multi-location capabilities", 
          "Better hardware durability"
        ],
        correctAnswer: 2
      },
      {
        question: "Which feature is specifically important for restaurant payment processing?",
        options: ["Barcode scanning", "Split check functionality", "Purchase order matching", "Patient payment plans"],
        correctAnswer: 1
      },
      {
        question: "For a B2B payment processor, which feature helps reduce interchange fees?",
        options: [
          "Level II/III data capture", 
          "Mobile payment acceptance", 
          "Customer loyalty programs", 
          "Digital gift cards"
        ],
        correctAnswer: 0
      },
      {
        question: "What payment solution would be most appropriate for a new small business processing under $5,000 monthly?",
        options: [
          "Custom interchange-plus pricing with advanced POS", 
          "Traditional merchant account with a dedicated terminal", 
          "Simplified flat-rate solution like Square or PayPal", 
          "Subscription-based wholesale processing model"
        ],
        correctAnswer: 2
      }
    ]
  }
};

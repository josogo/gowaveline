export interface LessonSection {
  title: string;
  content: string;
  image?: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  sections: LessonSection[];
  quiz: {
    questions: Question[];
  };
}

export const lessonContents: LessonContent[] = [
  {
    id: 1,
    title: 'What Happens in a Credit Card Transaction?',
    description: 'Understand every stage of the payment journey from initial swipe to settlement',
    duration: '30 min',
    topics: [
      'Card networks and issuers',
      'Authorization and settlement processes',
      'Transaction fees breakdown',
      'What happens behind the scenes',
      'Common transaction issues'
    ],
    sections: [
      {
        title: 'Understanding the Players',
        content: `
          <p>Every credit card transaction involves multiple parties working together in a complex ecosystem. The main players are:</p>
          <ul>
            <li><strong>Cardholder</strong>: The person or entity that owns the credit card and initiates a payment.</li>
            <li><strong>Merchant</strong>: The business that accepts the credit card as payment for goods or services.</li>
            <li><strong>Acquirer/Acquiring Bank</strong>: The merchant's bank that processes credit card payments and deposits funds into the merchant's account.</li>
            <li><strong>Card Network</strong>: Companies like Visa, Mastercard, American Express, and Discover that facilitate transactions between merchants, acquirers, and issuers.</li>
            <li><strong>Issuer/Issuing Bank</strong>: The financial institution that provides credit cards to consumers and pays the acquiring bank for purchases.</li>
            <li><strong>Payment Processor</strong>: The company that handles transaction details between the merchant and the acquiring bank.</li>
          </ul>
          <p>Understanding the roles of these entities is crucial for comprehending how money flows during a transaction and where fees are generated.</p>
        `,
        image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/payment-ecosystem-diagram.png'
      },
      {
        title: 'The Authorization Process',
        content: `
          <p>When a customer makes a purchase, the authorization process begins:</p>
          <ol>
            <li><strong>Initiation</strong>: The cardholder presents their card for payment (swipe, tap, insert, or online entry).</li>
            <li><strong>Data Transmission</strong>: The card data is sent from the payment terminal or website to the payment processor.</li>
            <li><strong>Processor Routing</strong>: The processor routes the transaction data to the appropriate card network (Visa, Mastercard, etc.).</li>
            <li><strong>Network to Issuer</strong>: The card network forwards the authorization request to the issuing bank.</li>
            <li><strong>Verification</strong>: The issuing bank verifies the card details, checks for available funds or credit, and runs fraud checks.</li>
            <li><strong>Response</strong>: The issuing bank sends an approval or denial code back through the same path to the merchant.</li>
            <li><strong>Customer Notification</strong>: The merchant informs the customer of the approval or denial.</li>
          </ol>
          <p>This entire process typically takes just 2-3 seconds, though it may vary based on connection speeds and system load.</p>
        `,
        image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/authorization-flow-chart.png'
      },
      {
        title: 'Clearing and Settlement',
        content: `
          <p>After authorization, the transaction must be settled to transfer actual funds:</p>
          <ol>
            <li><strong>Batching</strong>: At the end of the day, the merchant "batches" all approved authorizations for settlement.</li>
            <li><strong>Batch Processing</strong>: The acquiring bank sends the batch to the card networks.</li>
            <li><strong>Clearing</strong>: Each card network sorts the transactions and sends them to the appropriate issuing banks.</li>
            <li><strong>Issuer Processing</strong>: Issuing banks debit the cardholders' accounts for the purchase amounts.</li>
            <li><strong>Fund Transfer</strong>: The issuing bank transfers funds to the card network, which transfers funds to the acquiring bank.</li>
            <li><strong>Merchant Deposit</strong>: The acquiring bank deposits the funds in the merchant's account (minus fees).</li>
          </ol>
          <p>The settlement process typically takes 24-72 hours to complete, which explains why transactions may appear as "pending" on a customer's account for a few days.</p>
        `,
        image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/settlement-process-diagram.png'
      },
      {
        title: 'Fee Structure Breakdown',
        content: `
          <p>Every credit card transaction generates various fees distributed among the involved parties:</p>
          <ul>
            <li><strong>Interchange Fee</strong>: Paid by the acquiring bank to the issuing bank, typically 1.5-3.5% of the transaction amount plus a fixed fee. These rates vary based on:
              <ul>
                <li>Card type (rewards cards have higher fees)</li>
                <li>Transaction method (card-present vs. card-not-present)</li>
                <li>Merchant category</li>
                <li>Transaction size</li>
              </ul>
            </li>
            <li><strong>Assessment Fee</strong>: Paid to the card network, typically 0.13-0.15% of the transaction amount.</li>
            <li><strong>Processor Markup</strong>: Additional fees charged by the processor, which can be a percentage, flat fee, or both.</li>
            <li><strong>Merchant Service Provider Fee</strong>: Charges added by ISOs or MSPs that sell processing services.</li>
          </ul>
          <p>For example, on a $100 purchase with a rewards credit card, the total fees might break down as:</p>
          <ul>
            <li>Interchange: $2.10 (2.10%)</li>
            <li>Assessment: $0.13 (0.13%)</li>
            <li>Processor markup: $0.25 (0.25%)</li>
            <li>Total merchant discount rate: $2.48 (2.48%)</li>
          </ul>
          <p>This means the merchant would receive $97.52 from this $100 transaction.</p>
        `
      },
      {
        title: 'Common Transaction Issues',
        content: `
          <p>Several issues can occur during the transaction process:</p>
          <ul>
            <li><strong>Declines</strong>: Can happen for various reasons:
              <ul>
                <li>Insufficient funds/credit</li>
                <li>Expired card</li>
                <li>Incorrect CVV or billing information</li>
                <li>Suspicious activity triggering fraud alerts</li>
                <li>Technical issues with the processing system</li>
              </ul>
            </li>
            <li><strong>Chargebacks</strong>: When a customer disputes a transaction, triggering a complex resolution process:
              <ul>
                <li>Customer files dispute with issuing bank</li>
                <li>Merchant receives chargeback notification</li>
                <li>Merchant can accept or fight the chargeback</li>
                <li>Evidence must be submitted if fighting the chargeback</li>
                <li>Final decision made by the issuing bank</li>
              </ul>
            </li>
            <li><strong>Authorization Holds</strong>: When funds are held but not captured, which can cause customer confusion.</li>
            <li><strong>Processing Delays</strong>: Technical issues that can delay settlement.</li>
          </ul>
          <p>Understanding these issues helps merchants troubleshoot problems and explain situations to customers.</p>
        `
      }
    ],
    quiz: {
      questions: [
        {
          question: "Which entity provides credit cards to consumers and pays the acquiring bank for purchases?",
          options: ["Card Network", "Payment Processor", "Issuing Bank", "Merchant"],
          correctAnswer: 2
        },
        {
          question: "In which stage of a credit card transaction are funds actually transferred from the customer to the merchant?",
          options: ["Authorization", "Batching", "Settlement", "Processing"],
          correctAnswer: 2
        },
        {
          question: "Which of the following fees is paid by the acquiring bank to the issuing bank?",
          options: ["Assessment Fee", "Interchange Fee", "Processor Markup", "Gateway Fee"],
          correctAnswer: 1
        },
        {
          question: "Approximately how long does the authorization process typically take?",
          options: ["30-60 seconds", "5-10 seconds", "2-3 seconds", "1-2 minutes"],
          correctAnswer: 2
        },
        {
          question: "When a customer disputes a transaction, this is known as:",
          options: ["Decline", "Chargeback", "Authorization Hold", "Batching Error"],
          correctAnswer: 1
        }
      ]
    }
  },
  {
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
            <li><strong>MSP (Member Service Provider)</strong>: Similar to an ISO but officially registered with card networks (usually Mastercard). This designation:
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
  },
  {
    id: 3,
    title: 'Pricing Models & Profit Margins',
    description: 'Master the different pricing structures and understand profit margins',
    duration: '50 min',
    topics: [
      'Interchange Plus pricing',
      'Tiered pricing structures',
      'Flat rate models (Square, Stripe)',
      'Subscription/wholesale models',
      'Calculating merchant effective rates'
    ],
    sections: [
      {
        title: 'Understanding Interchange Plus Pricing',
        content: `
          <p>Interchange Plus (sometimes called "Cost Plus") is considered the most transparent pricing model in the payment processing industry. Here's how it works:</p>
          <ul>
            <li><strong>Structure</strong>: Interchange fee + Assessment fee + Processor markup</li>
            <li><strong>Interchange</strong>: The non-negotiable fee set by card networks that goes to the issuing bank</li>
            <li><strong>Assessment</strong>: The fee charged by card networks (Visa, Mastercard, etc.)</li>
            <li><strong>Markup</strong>: The processor's profit, typically quoted as "X basis points + $Y per transaction"</li>
          </ul>
          <p>For example, a typical Interchange Plus rate might be "Interchange + 0.25% + $0.10," meaning the merchant pays:</p>
          <ul>
            <li>The interchange rate (varies by card type, industry, and transaction method)</li>
            <li>Plus 0.25% of the transaction amount</li>
            <li>Plus 10 cents per transaction</li>
          </ul>
          <p><strong>Advantages of Interchange Plus:</strong></p>
          <ul>
            <li>Transparency: Merchants can see exactly what portion goes to the bank, network, and processor</li>
            <li>Fairness: Merchants benefit from lower interchange rates (e.g., when customers use debit cards)</li>
            <li>Consistency: The markup remains constant regardless of card type</li>
          </ul>
          <p><strong>Best for:</strong> Medium to large businesses with high transaction volumes, businesses that want transparency, and merchants with a varied mix of card types.</p>
        `,
        image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/interchange-plus-diagram.png'
      },
      {
        title: 'Tiered Pricing Structures',
        content: `
          <p>Tiered pricing simplifies the complex world of interchange rates by grouping transactions into 3-4 categories or "tiers." These typically include:</p>
          <ul>
            <li><strong>Qualified</strong>: The lowest rate, applied to standard consumer credit cards that are swiped/inserted/tapped (card-present)</li>
            <li><strong>Mid-Qualified</strong>: A medium rate for transactions that don't meet all qualified criteria (e.g., manually keyed with address verification, rewards cards)</li>
            <li><strong>Non-Qualified</strong>: The highest rate, applied to high-risk transactions (e.g., corporate cards, international cards, card-not-present without proper security measures)</li>
          </ul>
          <p>For example, a tiered pricing structure might look like:</p>
          <ul>
            <li>Qualified: 1.79% + $0.10</li>
            <li>Mid-Qualified: 2.19% + $0.15</li>
            <li>Non-Qualified: 2.99% + $0.20</li>
          </ul>
          <p><strong>Key aspects of tiered pricing:</strong></p>
          <ul>
            <li>Processors determine which tier each transaction falls into, often based on internal rules</li>
            <li>The actual cost to the processor (interchange) may vary significantly within each tier</li>
            <li>Rewards cards and premium cards typically fall into more expensive tiers</li>
          </ul>
          <p><strong>Advantages for processors:</strong></p>
          <ul>
            <li>Simplifies billing and explanation to merchants</li>
            <li>Creates opportunities for higher margins on certain transactions</li>
            <li>Makes it easier to create appealing headline rates ("as low as 1.79%")</li>
          </ul>
          <p><strong>Disadvantages for merchants:</strong></p>
          <ul>
            <li>Less transparency about actual costs</li>
            <li>Many modern transactions fall into mid or non-qualified categories</li>
            <li>Difficult to compare offers between processors</li>
          </ul>
          <p><strong>Best for:</strong> Small businesses with simple needs, merchants who value predictability over maximizing savings, and businesses with predominantly basic card types.</p>
        `,
        image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/tiered-pricing-chart.png'
      },
      {
        title: 'Flat Rate Models (Square, Stripe, etc.)',
        content: `
          <p>Flat rate pricing is the simplest model to understand: one consistent rate regardless of card type or processing method. This model has been popularized by services like Square, Stripe, and PayPal.</p>
          <p><strong>Common flat rate structures:</strong></p>
          <ul>
            <li><strong>Single percentage</strong>: e.g., 2.9% for all transactions</li>
            <li><strong>Percentage + fixed fee</strong>: e.g., 2.6% + $0.10 per transaction</li>
            <li><strong>Different rates for card-present vs card-not-present</strong>: e.g., 2.6% + $0.10 for in-person; 2.9% + $0.30 for online</li>
          </ul>
          <p><strong>Advantages:</strong></p>
          <ul>
            <li>Extreme simplicity and predictability</li>
            <li>No monthly fees or minimums (typically)</li>
            <li>Easy setup with minimal paperwork</li>
            <li>Often includes free basic equipment (like Square reader)</li>
            <li>Usually includes a payment gateway and software features</li>
          </ul>
          <p><strong>Disadvantages:</strong></p>
          <ul>
            <li>Generally more expensive for large transaction volumes</li>
            <li>No benefit when customers use cards with lower interchange rates</li>
            <li>Limited customization for business-specific needs</li>
            <li>Can have higher rates of holds, freezes, and account terminations</li>
          </ul>
          <p><strong>How flat rate providers profit:</strong></p>
          <p>Companies like Square pay interchange and assessment fees just like traditional processors. They make money by:</p>
          <ul>
            <li>Charging enough to cover the highest interchange categories</li>
            <li>Profiting from the spread between their flat rate and the actual interchange</li>
            <li>Benefiting from economies of scale across millions of merchants</li>
            <li>Cross-selling additional services (payroll, marketing, capital advances)</li>
          </ul>
          <p><strong>Best for:</strong> New businesses, low-volume merchants (less than $5,000/month), businesses that prioritize simplicity, and those that value the additional software features.</p>
        `,
        image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/flat-rate-visual.png'
      },
      {
        title: 'Subscription/Wholesale Models',
        content: `
          <p>The subscription or "membership" pricing model is one of the newer innovations in payment processing. It separates the processor's compensation from transaction volume by charging:</p>
          <ul>
            <li>A fixed monthly subscription fee (e.g., $99/month)</li>
            <li>Pass-through interchange and assessment fees (similar to interchange plus)</li>
            <li>A small per-transaction fee (e.g., $0.08 per transaction)</li>
          </ul>
          <p><strong>Key characteristics:</strong></p>
          <ul>
            <li>Merchants pay close to "wholesale" rates for payment processing</li>
            <li>The processor's profit comes primarily from the subscription rather than a percentage markup</li>
            <li>Significantly reduces percentage-based fees, especially for high-ticket businesses</li>
            <li>Different subscription tiers may offer varying levels of service or transaction volume limits</li>
          </ul>
          <p><strong>Example structure:</strong></p>
          <ul>
            <li><strong>Basic Plan</strong>: $59/month + Interchange + $0.10 per transaction (up to $25,000/month)</li>
            <li><strong>Professional Plan</strong>: $99/month + Interchange + $0.07 per transaction (up to $75,000/month)</li>
            <li><strong>Enterprise Plan</strong>: $199/month + Interchange + $0.05 per transaction (unlimited)</li>
          </ul>
          <p><strong>Best use cases:</strong></p>
          <ul>
            <li>High average ticket businesses (e.g., jewelry, furniture)</li>
            <li>High volume merchants with predictable processing patterns</li>
            <li>Businesses with average tickets over $100 where percentage fees add up quickly</li>
            <li>Merchants who understand interchange and want maximum transparency</li>
          </ul>
          <p><strong>Popular providers:</strong></p>
          <ul>
            <li>Payment Depot</li>
            <li>Fattmerchant</li>
            <li>Dharma Merchant Services</li>
            <li>Membership Works</li>
          </ul>
          <p><strong>Potential drawbacks:</strong></p>
          <ul>
            <li>Not cost-effective for low-volume or low-ticket businesses</li>
            <li>Monthly fee is charged regardless of processing volume</li>
            <li>Can be more complex to explain to merchants unfamiliar with interchange</li>
          </ul>
        `,
        image: 'https://lovable-uploads.s3.us-east-1.amazonaws.com/images/subscription-model-chart.png'
      },
      {
        title: 'Calculating Merchant Effective Rates',
        content: `
          <p>The effective rate is one of the most important metrics for comparing processing costs across different pricing models. It represents the total cost of processing as a percentage of total sales volume.</p>
          <p><strong>Calculation:</strong></p>
          <div style="background-color:#f9f9f9; padding:15px; border-radius:5px; margin:10px 0;">
            <strong>Effective Rate (%) = (Total Fees / Total Sales Volume) × 100%</strong>
          </div>
          <p><strong>Example:</strong></p>
          <ul>
            <li>Monthly sales volume: $50,000</li>
            <li>Transaction count: 500</li>
            <li>Total fees (including percentage fees, transaction fees, monthly fees): $1,250</li>
            <li>Effective rate: ($1,250 / $50,000) × 100% = 2.5%</li>
          </ul>
          <p><strong>What to include in "total fees":</strong></p>
          <ul>
            <li>All percentage-based fees</li>
            <li>Per-transaction fees</li>
            <li>Monthly service fees</li>
            <li>Gateway fees</li>
            <li>Statement fees</li>
            <li>PCI compliance fees</li>
            <li>Any other regular fees</li>
          </ul>
          <p><strong>Using effective rates to evaluate pricing models:</strong></p>
          <p>Let's compare how different pricing models might affect a merchant with:</p>
          <ul>
            <li>$30,000 monthly volume</li>
            <li>300 transactions</li>
            <li>Average ticket: $100</li>
          </ul>
          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <tr style="background-color:#f2f2f2;">
              <th style="border:1px solid #ddd; padding:8px; text-align:left;">Pricing Model</th>
              <th style="border:1px solid #ddd; padding:8px; text-align:left;">Rate Structure</th>
              <th style="border:1px solid #ddd; padding:8px; text-align:left;">Monthly Cost</th>
              <th style="border:1px solid #ddd; padding:8px; text-align:left;">Effective Rate</th>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px;">Flat Rate</td>
              <td style="border:1px solid #ddd; padding:8px;">2.6% + $0.10 per transaction</td>
              <td style="border:1px solid #ddd; padding:8px;">$810 (fees) + $30 (transaction fees)</td>
              <td style="border:1px solid #ddd; padding:8px;">2.8%</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px;">Tiered</td>
              <td style="border:1px solid #ddd; padding:8px;">60% Qualified (1.79%), 30% Mid-Qualified (2.19%), 10% Non-Qualified (2.99%) + $20 monthly</td>
              <td style="border:1px solid #ddd; padding:8px;">$645 (fees) + $20 (monthly)</td>
              <td style="border:1px solid #ddd; padding:8px;">2.22%</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px;">Interchange Plus</td>
              <td style="border:1px solid #ddd; padding:8px;">Interchange (avg 1.65%) + 0.25% + $0.10 per transaction + $10 monthly</td>
              <td style="border:1px solid #ddd; padding:8px;">$570 (fees) + $30 (transaction fees) + $10 (monthly)</td>
              <td style="border:1px solid #ddd; padding:8px;">2.03%</td>
            </tr>
            <tr>
              <td style="border:1px solid #ddd; padding:8px;">Subscription</td>
              <td style="border:1px solid #ddd; padding:8px;">$99 monthly + Interchange (avg 1.65%) + $0.07 per transaction</td>
              <td style="border:1px solid #ddd; padding:8px;">$495 (interchange) + $21 (transaction fees) + $99 (subscription)</td>
              <td style="border:1px solid #ddd; padding:8px;">2.05%</td>
            </tr>
          </table>
          <p>This comparison demonstrates how different pricing models can be more or less cost-effective depending on a merchant's specific processing profile.</p>
          <p><strong>Key insights for sales professionals:</strong></p>
          <ul>
            <li>Always calculate the effective rate when comparing pricing options</li>
            <li>Consider the merchant's average ticket size and monthly volume when recommending a pricing model</li>
            <li>For high-ticket merchants, subscription models often provide the lowest effective rate</li>
            <li>For low-volume merchants, flat rate models might be more economical despite higher percentage fees</li>
            <li>For businesses with varied card types, interchange plus offers the most transparency</li>
          </ul>
        `
      }
    ],
    quiz: {
      questions: [
        {
          question: "Which pricing model typically offers the most transparency for merchants?",
          options: ["Tiered pricing", "Flat rate pricing", "Interchange Plus pricing", "Subscription pricing"],
          correctAnswer: 2
        },
        {
          question: "In a tiered pricing model, which category typically has the highest rates?",
          options: ["Qualified", "Mid-Qualified", "Non-Qualified", "Super-Qualified"],
          correctAnswer: 2
        },
        {
          question: "Which pricing model would likely be most cost-effective for a jewelry store with high average tickets ($5,000+)?",
          options: ["Flat rate (like Square)", "Subscription/membership model", "Basic tiered pricing", "Daily discount"],
          correctAnswer: 1
        },
        {
          question: "How is a merchant's effective rate calculated?",
          options: [
            "Base rate + processor markup", 
            "(Total fees / Total sales volume) × 100%", 
            "Monthly fee ÷ number of transactions", 
            "Interchange rate × transaction volume"
          ],
          correctAnswer: 1
        },
        {
          question: "What is typically included in an Interchange Plus pricing structure?",
          options: [
            "Interchange fee + Assessment fee + Processor markup", 
            "Qualified rate + Non-qualified surcharge", 
            "Monthly subscription + Transaction fee", 
            "Flat percentage + Equipment rental fee"
          ],
          correctAnswer: 0
        }
      ]
    }
  },
  {
    id: 4,
    title:

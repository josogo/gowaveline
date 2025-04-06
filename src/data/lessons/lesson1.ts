
import { LessonContent } from '../types/lessonTypes';

export const lesson1: LessonContent = {
  id: 1,
  title: 'Fundamentals of Credit Card Processing',
  description: 'Introduction to the basics of credit card processing and payment ecosystems',
  duration: '45 min',
  topics: [
    'Introduction to Credit Card Processing',
    'The Credit Card Transaction Process',
    'Key Participants in the Payment Ecosystem',
    'Types of Card Transactions',
    'Transaction Flow Case Study'
  ],
  sections: [
    {
      title: 'Introduction to Credit Card Processing',
      content: `
        <p>Credit card processing is a fundamental component of modern commerce, enabling secure and efficient payment transactions.</p>
        
        <p><strong>Industry Scale:</strong></p>
        <ul>
          <li>Credit card payments reached approximately $5.6 trillion in 2023, an 11% increase from the previous year</li>
          <li>Global transaction volume continues to grow as cash usage declines</li>
          <li>E-commerce acceleration further drives card processing adoption</li>
        </ul>
        
        <p><strong>Basic Terminology:</strong></p>
        <ul>
          <li><strong>Authorization:</strong> Process of checking if a card is valid for purchase</li>
          <li><strong>Settlement:</strong> Process of transferring funds between banks</li>
          <li><strong>Batch:</strong> Group of transactions processed together</li>
          <li><strong>Interchange:</strong> Fee paid between banks for acceptance of card transactions</li>
        </ul>
      `
    },
    {
      title: 'The Credit Card Transaction Process',
      content: `
        <p><strong>Authorization Phase:</strong></p>
        <ul>
          <li>Card information capture via swipe, dip (EMV chip), or contactless (NFC) methods</li>
          <li>Encryption of sensitive data</li>
          <li>Verification checks including AVS (Address Verification Service), CVV validation</li>
          <li>Fraud screening algorithms</li>
          <li>Approval or decline response from the issuing bank</li>
        </ul>
        
        <p><strong>Settlement and Clearing Phase:</strong></p>
        <ul>
          <li>Batch processing explained: transactions grouped for efficiency</li>
          <li>Typical timeframes: next-day funding vs. same-day options</li>
          <li>Daily cut-off times for batch submissions</li>
          <li>Weekend/holiday processing considerations</li>
        </ul>
        
        <p><strong>Chargeback and Dispute Resolution:</strong></p>
        <ul>
          <li>Common causes: fraud, customer dissatisfaction, delivery issues</li>
          <li>Merchant rights: evidence submission, compelling case building</li>
          <li>Prevention strategies: clear policies, delivery confirmation, fraud tools</li>
          <li>Chargeback ratio management and its importance</li>
        </ul>
      `
    },
    {
      title: 'Key Participants in the Payment Ecosystem',
      content: `
        <p>The credit card processing ecosystem involves multiple participants with specific roles:</p>
        
        <ul>
          <li><strong>Cardholder:</strong> The consumer who uses the payment card</li>
          <li><strong>Merchant:</strong> Business accepting card payments</li>
          <li><strong>Issuing Bank:</strong> Financial institution that provides cards to consumers</li>
          <li><strong>Acquiring Bank:</strong> Financial institution that processes payments for merchants</li>
          <li><strong>Payment Processor:</strong> Company that handles transaction routing</li>
          <li><strong>Card Networks:</strong> Visa, Mastercard, American Express, Discover - establish rules and standards</li>
          <li><strong>Payment Gateway:</strong> Technology that connects merchants to processors</li>
          <li><strong>Independent Sales Organizations (ISOs):</strong> Third-party payment processor resellers</li>
        </ul>
        
        <p>Each entity in this ecosystem earns revenue through various fee structures, creating the complex pricing models seen in merchant services.</p>
      `
    },
    {
      title: 'Types of Card Transactions',
      content: `
        <p><strong>Card-Present vs. Card-Not-Present:</strong></p>
        <ul>
          <li><strong>Card-Present:</strong> Lower risk, lower interchange fees</li>
          <li><strong>Card-Not-Present:</strong> Higher risk, higher interchange fees</li>
        </ul>
        
        <p><strong>Point-of-Sale (POS) Transactions:</strong></p>
        <ul>
          <li>Traditional retail countertop terminals</li>
          <li>Integrated POS systems with inventory management</li>
          <li>Mobile POS solutions for on-the-go businesses</li>
        </ul>
        
        <p><strong>E-commerce Transactions:</strong></p>
        <ul>
          <li>Website payment gateways</li>
          <li>Shopping cart integrations</li>
          <li>Enhanced security requirements</li>
        </ul>
        
        <p><strong>Mobile Payment Transactions:</strong></p>
        <ul>
          <li>Digital wallets (Apple Pay, Google Pay, Samsung Pay)</li>
          <li>In-app purchases</li>
          <li>QR code-based payments</li>
        </ul>
        
        <p><strong>Recurring Billing:</strong></p>
        <ul>
          <li>Subscription-based models</li>
          <li>Account updater services</li>
          <li>Retry logic for failed payments</li>
        </ul>
      `
    },
    {
      title: 'Transaction Flow Case Study',
      content: `
        <p><strong>Step-by-Step Retail Purchase:</strong></p>
        <ol>
          <li><strong>Initiation:</strong> Customer presents card at point of sale</li>
          <li><strong>Data Capture:</strong> Terminal reads card information</li>
          <li><strong>Authentication:</strong> PIN or signature verification where required</li>
          <li><strong>Authorization Request:</strong> Terminal sends encrypted transaction data to processor</li>
          <li><strong>Routing:</strong> Processor routes request to appropriate card network</li>
          <li><strong>Issuer Approval:</strong> Card-issuing bank checks for funds and approves/declines</li>
          <li><strong>Response Transmission:</strong> Approval flows back through the same channels</li>
          <li><strong>Transaction Completion:</strong> Terminal displays approval and prints receipt</li>
          <li><strong>Batch Settlement:</strong> Transaction stored for end-of-day processing</li>
          <li><strong>Funding:</strong> Merchant receives funds in bank account (typically 24-48 hours later)</li>
        </ol>
        
        <p><strong>Key Timeframes:</strong></p>
        <ul>
          <li>Authorization: 2-3 seconds</li>
          <li>Settlement: 24-48 hours typically</li>
          <li>Dispute window: Up to 120 days (network dependent)</li>
        </ul>
        
        <p>This entire process happens within seconds at the point of sale, demonstrating the sophisticated infrastructure supporting everyday transactions.</p>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Which participant in the payment ecosystem issues credit cards to consumers?",
        options: ["Acquiring Bank", "Payment Processor", "Issuing Bank", "Card Network"],
        correctAnswer: 2
      },
      {
        question: "Which phase of credit card processing involves checking if a customer's card is valid for the purchase?",
        options: ["Settlement", "Authorization", "Batching", "Clearing"],
        correctAnswer: 1
      },
      {
        question: "Which type of transaction typically has lower interchange fees due to reduced risk?",
        options: ["E-commerce transactions", "Mobile payments", "Recurring billing", "Card-present transactions"],
        correctAnswer: 3
      },
      {
        question: "Approximately how much did credit card payment volume reach in 2023?",
        options: ["$2.1 trillion", "$3.8 trillion", "$5.6 trillion", "$7.2 trillion"],
        correctAnswer: 2
      },
      {
        question: "Which of the following is NOT one of the key participants in the payment ecosystem?",
        options: ["Cardholder", "Payment Gateway", "Merchant", "Inventory Manager"],
        correctAnswer: 3
      }
    ]
  }
};

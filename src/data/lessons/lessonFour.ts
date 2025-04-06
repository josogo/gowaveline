
import { LessonContent } from '../types/lessons';

export const lessonFour: LessonContent = {
  id: 4,
  title: 'Fundamentals of Credit Card Processing',
  description: 'Learn the core concepts behind credit card processing systems',
  duration: '40 min',
  topics: [
    'Introduction to Credit Card Processing',
    'The Credit Card Transaction Process',
    'Chargeback and Dispute Resolution',
    'Key Participants in the Payment Ecosystem',
    'Types of Card Transactions'
  ],
  sections: [
    {
      title: 'Introduction to Credit Card Processing',
      content: `
        <p>Credit card processing forms the backbone of modern commerce, enabling seamless transactions between consumers and businesses:</p>
        <ul>
          <li><strong>Definition and importance:</strong> The system that allows businesses to accept card payments from customers by securely transferring funds from the customer's card account to the merchant's bank account.</li>
          <li><strong>Industry scale:</strong> Credit card payments reached approximately $5.6 trillion in 2023, an 11% increase from the previous year.</li>
          <li><strong>Basic terminology:</strong>
            <ul>
              <li><strong>Authorization:</strong> Approval from the issuing bank to proceed with a transaction</li>
              <li><strong>Settlement:</strong> The process of transferring funds to the merchant's account</li>
              <li><strong>Batch:</strong> A group of transactions processed together</li>
              <li><strong>Terminal:</strong> Device used to accept card payments</li>
              <li><strong>Gateway:</strong> Software that facilitates online payments</li>
            </ul>
          </li>
        </ul>
        <p>Understanding these fundamentals is essential for anyone working in merchant services, as they form the foundation for all payment processing discussions with clients.</p>
      `
    },
    {
      title: 'The Credit Card Transaction Process',
      content: `
        <p>The credit card transaction process consists of two main phases: authorization and settlement.</p>
        
        <h3>Authorization Phase</h3>
        <ol>
          <li><strong>Card information capture:</strong> Customer's card details are collected via:
            <ul>
              <li><strong>Swipe:</strong> Reading the magnetic stripe</li>
              <li><strong>Dip:</strong> Inserting an EMV chip card</li>
              <li><strong>Contactless:</strong> Using NFC technology (tap)</li>
              <li><strong>Manual entry:</strong> Keying card details for phone/online orders</li>
            </ul>
          </li>
          <li><strong>Verification and security checks:</strong>
            <ul>
              <li>Card number validation (Luhn algorithm)</li>
              <li>Expiration date check</li>
              <li>CVV/security code verification</li>
              <li>Address Verification Service (AVS)</li>
              <li>Fraud screening algorithms</li>
            </ul>
          </li>
          <li><strong>Approval or decline decision:</strong>
            <ul>
              <li>Approved: Transaction continues to settlement</li>
              <li>Declined: Transaction is rejected with a reason code</li>
              <li>Referred: Manual review required</li>
            </ul>
          </li>
        </ol>
        
        <h3>Settlement and Clearing Phase</h3>
        <ol>
          <li><strong>Batch processing:</strong> Merchant groups approved transactions (usually daily)</li>
          <li><strong>Timeframes:</strong> Typically 24-72 hours for standard transactions</li>
          <li><strong>Daily settlement process:</strong>
            <ul>
              <li>Merchant submits batch of transactions</li>
              <li>Processor routes transactions to appropriate networks</li>
              <li>Issuing banks transfer funds to acquiring banks</li>
              <li>Funds deposited into merchant account minus fees</li>
            </ul>
          </li>
        </ol>
        <p>This entire process happens billions of times daily across the global economy, usually completing within seconds for the authorization phase and days for the complete settlement.</p>
      `
    },
    {
      title: 'Chargeback and Dispute Resolution',
      content: `
        <p>Chargebacks are one of the most challenging aspects of payment processing for merchants:</p>
        
        <h3>Common Causes of Chargebacks</h3>
        <ul>
          <li><strong>True fraud:</strong> Unauthorized transactions from stolen cards</li>
          <li><strong>"Friendly" fraud:</strong> Customer doesn't recognize the charge or seeks to avoid payment</li>
          <li><strong>Processing errors:</strong> Duplicate charges or incorrect amounts</li>
          <li><strong>Product/service issues:</strong> Item not received, defective, or not as described</li>
          <li><strong>Subscription cancellation issues:</strong> Continued billing after cancellation</li>
        </ul>
        
        <h3>Merchant Rights and Responsibilities</h3>
        <ul>
          <li><strong>Right to dispute:</strong> Merchants can contest illegitimate chargebacks</li>
          <li><strong>Evidence requirements:</strong> Transaction records, delivery confirmation, communications</li>
          <li><strong>Response timeframes:</strong> Usually 7-30 days to respond to a chargeback</li>
          <li><strong>Financial liability:</strong> Chargeback fees ($15-$100 per incident) plus transaction amount</li>
        </ul>
        
        <h3>Prevention Strategies</h3>
        <ul>
          <li><strong>Clear billing descriptors:</strong> Recognizable merchant names on statements</li>
          <li><strong>Delivery confirmation:</strong> Tracking and signature requirements</li>
          <li><strong>Detailed policies:</strong> Clear return, refund, and cancellation policies</li>
          <li><strong>Customer service:</strong> Responsive support to resolve issues before chargebacks</li>
          <li><strong>Fraud prevention tools:</strong> 3D Secure, AVS, CVV verification</li>
        </ul>
        <p>Helping merchants understand and prepare for chargebacks is a valuable service that payment professionals can provide, potentially saving businesses thousands in fees and lost revenue.</p>
      `
    },
    {
      title: 'Key Participants in the Payment Ecosystem',
      content: `
        <p>The payment ecosystem involves multiple parties working together to process transactions:</p>
        
        <ul>
          <li><strong>Cardholder:</strong> The consumer who uses the payment card
            <ul>
              <li>Initiates the transaction</li>
              <li>Responsible for legitimate use of the card</li>
              <li>Has protection rights against unauthorized charges</li>
            </ul>
          </li>
          <li><strong>Merchant:</strong> The business accepting the payment
            <ul>
              <li>Collects payment information</li>
              <li>Maintains compliant payment systems</li>
              <li>Pays processing fees</li>
            </ul>
          </li>
          <li><strong>Issuing Bank:</strong> The financial institution that provides cards to consumers
            <ul>
              <li>Extends credit or holds funds</li>
              <li>Approves or declines transactions</li>
              <li>Manages cardholder accounts and statements</li>
              <li>Collects interchange fees</li>
            </ul>
          </li>
          <li><strong>Acquiring Bank:</strong> The merchant's financial institution
            <ul>
              <li>Maintains merchant accounts</li>
              <li>Processes payments on behalf of merchants</li>
              <li>Deposits funds into merchant accounts</li>
              <li>Assumes risk for merchant transactions</li>
            </ul>
          </li>
          <li><strong>Payment Processor:</strong> Handles transaction routing
            <ul>
              <li>Connects merchants to acquiring banks</li>
              <li>Routes transaction data</li>
              <li>Provides processing infrastructure</li>
              <li>Often supplies payment technology</li>
            </ul>
          </li>
          <li><strong>Card Networks:</strong> Organizations like Visa, Mastercard, etc.
            <ul>
              <li>Set rules and standards for transactions</li>
              <li>Facilitate data transmission between parties</li>
              <li>Determine interchange rates</li>
              <li>Mediate disputes between issuers and acquirers</li>
            </ul>
          </li>
        </ul>
        <p>Understanding the roles and relationships between these entities helps explain the flow of money and information in payment processing.</p>
      `
    },
    {
      title: 'Types of Card Transactions',
      content: `
        <p>Different transaction types have varying risk profiles, acceptance methods, and fee structures:</p>
        
        <h3>Card-Present vs. Card-Not-Present</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <tr style="background-color:#f2f2f2;">
            <th style="border:1px solid #ddd; padding:8px;">Feature</th>
            <th style="border:1px solid #ddd; padding:8px;">Card-Present</th>
            <th style="border:1px solid #ddd; padding:8px;">Card-Not-Present</th>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Physical card</td>
            <td style="border:1px solid #ddd; padding:8px;">Required</td>
            <td style="border:1px solid #ddd; padding:8px;">Not required</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Risk level</td>
            <td style="border:1px solid #ddd; padding:8px;">Lower</td>
            <td style="border:1px solid #ddd; padding:8px;">Higher</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Interchange rates</td>
            <td style="border:1px solid #ddd; padding:8px;">Lower</td>
            <td style="border:1px solid #ddd; padding:8px;">Higher</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; padding:8px;">Chargeback risk</td>
            <td style="border:1px solid #ddd; padding:8px;">Lower</td>
            <td style="border:1px solid #ddd; padding:8px;">Higher</td>
          </tr>
        </table>
        
        <h3>Point-of-Sale (POS) Transactions</h3>
        <ul>
          <li>In-person purchases at physical locations</li>
          <li>Lower risk due to physical verification</li>
          <li>EMV chip technology reduces fraud</li>
          <li>Immediate authorization and approval</li>
        </ul>
        
        <h3>E-commerce Transactions</h3>
        <ul>
          <li>Online purchases through websites/apps</li>
          <li>Higher risk without physical verification</li>
          <li>Requires additional security measures (3D Secure, etc.)</li>
          <li>Subject to higher processing rates</li>
        </ul>
        
        <h3>Mobile Payment Transactions</h3>
        <ul>
          <li>Payments via smartphone apps (Apple Pay, Google Pay)</li>
          <li>Typically utilize tokenization for security</li>
          <li>Can be either card-present (in-store NFC) or card-not-present (in-app)</li>
          <li>Growing rapidly in consumer adoption</li>
        </ul>
        
        <h3>Recurring Billing Considerations</h3>
        <ul>
          <li>Automated regular payments for subscriptions/services</li>
          <li>Requires securely stored payment credentials</li>
          <li>Higher risk of decline due to expired/replaced cards</li>
          <li>Account updater services can reduce failed payments</li>
          <li>Special regulations for cancellation and notifications</li>
        </ul>
        <p>Understanding these transaction types helps payment professionals recommend the right processing solutions for different business models and sales channels.</p>
      `
    },
    {
      title: 'Transaction Flow Case Study',
      content: `
        <p>Let's examine the complete journey of a typical credit card transaction at a retail store:</p>
        
        <h3>Step-by-Step Breakdown</h3>
        <ol>
          <li><strong>Initiation (0-2 seconds)</strong>
            <ul>
              <li>Customer presents card for $100 purchase</li>
              <li>Merchant swipes/dips/taps card at terminal</li>
              <li>Terminal captures card data and purchase amount</li>
            </ul>
          </li>
          <li><strong>Processing (2-4 seconds)</strong>
            <ul>
              <li>Terminal sends data to payment processor</li>
              <li>Processor routes to appropriate card network (e.g., Visa)</li>
              <li>Card network identifies issuing bank and forwards request</li>
            </ul>
          </li>
          <li><strong>Authorization (4-6 seconds)</strong>
            <ul>
              <li>Issuing bank checks account for funds/credit</li>
              <li>Bank runs fraud detection algorithms</li>
              <li>Bank sends approval code back through network</li>
              <li>Terminal displays approval and prints receipt</li>
            </ul>
          </li>
          <li><strong>Batching (End of business day)</strong>
            <ul>
              <li>Merchant closes batch with all day's transactions</li>
              <li>Terminal sends batch to processor</li>
            </ul>
          </li>
          <li><strong>Clearing (1-2 business days)</strong>
            <ul>
              <li>Processor sorts transactions by card network</li>
              <li>Networks distribute transactions to respective issuing banks</li>
              <li>Issuing bank posts final charges to cardholder accounts</li>
            </ul>
          </li>
          <li><strong>Settlement (2-3 business days)</strong>
            <ul>
              <li>Issuing bank transfers funds to acquiring bank</li>
              <li>Acquiring bank deposits funds in merchant account</li>
              <li>Merchant receives $97.52 (after 2.48% in total fees)</li>
            </ul>
          </li>
        </ol>
        
        <h3>Behind-the-Scenes Processes</h3>
        <ul>
          <li><strong>Security measures:</strong> Encryption, tokenization, fraud scoring</li>
          <li><strong>Fee calculations:</strong> Interchange rates assessed based on card type</li>
          <li><strong>Risk evaluations:</strong> Velocity checks, unusual purchase patterns</li>
        </ul>
        <p>This entire process—from card swipe to funds deposit—represents a remarkable achievement in financial technology, seamlessly connecting multiple parties across the globe in seconds.</p>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Approximately what value of credit card payments was processed in 2023?",
        options: ["$2.3 trillion", "$5.6 trillion", "$8.9 trillion", "$10.2 trillion"],
        correctAnswer: 1
      },
      {
        question: "Which of the following is NOT part of the authorization phase?",
        options: ["Card information capture", "Verification checks", "Batch processing", "Approval decision"],
        correctAnswer: 2
      },
      {
        question: "What is 'friendly fraud' in the context of chargebacks?",
        options: [
          "When a merchant accidentally overcharges a customer", 
          "When a customer doesn't recognize a legitimate charge and disputes it", 
          "When hackers steal card information", 
          "When a payment processor applies incorrect fees"
        ],
        correctAnswer: 1
      },
      {
        question: "Which entity is responsible for setting interchange rates?",
        options: ["Issuing bank", "Acquiring bank", "Card networks", "Payment processor"],
        correctAnswer: 2
      },
      {
        question: "Why do card-not-present transactions typically have higher interchange rates than card-present transactions?",
        options: [
          "They process faster", 
          "They have higher risk of fraud", 
          "They involve larger purchase amounts", 
          "They require more sophisticated technology"
        ],
        correctAnswer: 1
      }
    ]
  }
};

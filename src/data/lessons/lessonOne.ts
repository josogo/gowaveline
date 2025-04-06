
import { LessonContent } from '../types/lessons';

export const lessonOne: LessonContent = {
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
};

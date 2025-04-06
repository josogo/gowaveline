
import { ModuleContent } from '@/components/training/ModuleDetail';

// Module Content for "Understanding Interchange Fees"
export const interchangeFeesModule: ModuleContent = {
  id: 6,
  title: "Understanding Interchange Fees",
  description: "Learn how interchange fees work and how to explain them to merchants",
  duration: "45 minutes",
  sections: [
    {
      title: "What are Interchange Fees?",
      content: `
        <p>Interchange fees are transaction fees that the merchant's bank account must pay whenever a customer uses a credit/debit card to make a purchase. The fee is paid to the card-issuing bank to cover handling costs, fraud and bad debt costs and the risk involved in approving the payment.</p>
        <p>Key points about interchange fees:</p>
        <ul>
          <li>Set by card networks (Visa, Mastercard, etc.), not by payment processors</li>
          <li>Typically consists of a percentage plus a fixed fee (e.g., 1.65% + $0.10)</li>
          <li>Varies based on card type, transaction type, and merchant industry</li>
          <li>Comprises the largest portion of credit card processing costs</li>
        </ul>
      `,
      image: "/lovable-uploads/1273f62c-7839-4ba0-adb3-a65f0f996b3f.png"
    },
    {
      title: "How Networks Determine Rates",
      content: `
        <p>Card networks set interchange rates based on several risk factors and business considerations:</p>
        <h4 class="font-medium mt-4 mb-2">Risk Assessment Factors:</h4>
        <ul>
          <li><strong>Card-present vs. Card-not-present:</strong> In-person transactions have lower rates than online transactions due to lower fraud risk</li>
          <li><strong>Industry type:</strong> Some industries have higher chargeback rates and therefore higher interchange rates</li>
          <li><strong>Transaction size:</strong> Some categories have different rates for different transaction sizes</li>
          <li><strong>Card type:</strong> Premium rewards cards typically have higher interchange rates than standard cards</li>
        </ul>
        <p class="my-3">Networks publish interchange fee schedules twice a year (April and October), and these schedules can include hundreds of different rate categories.</p>
      `
    },
    {
      title: "Explaining Fees to Customers",
      content: `
        <p>When explaining interchange fees to merchants, focus on these key points:</p>
        <ul>
          <li><strong>Transparency:</strong> Emphasize that interchange is a cost set by card networks that all processors must pay</li>
          <li><strong>Value proposition:</strong> These fees enable card acceptance, which increases sales and average ticket size</li> 
          <li><strong>Optimization:</strong> Discuss how proper setup can help minimize interchange fees</li>
          <li><strong>Processing models:</strong> Explain the difference between tiered pricing, interchange-plus, and flat-rate models</li>
        </ul>
        <div class="bg-blue-50 p-4 rounded-md border border-blue-100 my-4">
          <p class="font-medium">Sample explanation for merchants:</p>
          <p>"Interchange fees are what the banks charge for processing card payments. Think of it as the wholesale cost of accepting cards. While we can't change these rates set by Visa and Mastercard, we can help ensure your business is set up to qualify for the lowest possible rates."</p>
        </div>
      `
    },
    {
      title: "Optimizing Processing for Lower Fees",
      content: `
        <p>Help merchants qualify for lower interchange rates with these best practices:</p>
        <ol>
          <li><strong>Proper business category codes:</strong> Ensure the merchant's MCC accurately reflects their business</li>
          <li><strong>Address Verification Service (AVS):</strong> For card-not-present transactions, use AVS to potentially qualify for better rates</li>
          <li><strong>Batch timing:</strong> Settle transactions within 24 hours</li>
          <li><strong>Proper card entry methods:</strong> Use EMV chip technology or contactless payments when possible</li>
          <li><strong>Level 2/3 data:</strong> For B2B transactions, provide additional transaction data to qualify for lower rates</li>
        </ol>
        <p class="mt-3">By implementing these practices, merchants can often save 0.25% to 1.00% on their effective processing rate.</p>
      `
    }
  ],
  quiz: {
    questions: [
      {
        question: "Who sets interchange fees?",
        options: [
          "Payment processors like Square or Stripe",
          "Card networks like Visa and Mastercard",
          "The merchant's bank",
          "Government financial regulators"
        ],
        correctAnswer: 1
      },
      {
        question: "Which of the following typically has the LOWEST interchange fees?",
        options: [
          "Online transaction with a rewards credit card",
          "In-person transaction with a debit card",
          "Phone order with a business credit card",
          "Recurring billing with a standard credit card"
        ],
        correctAnswer: 1
      },
      {
        question: "How often do card networks update their interchange rates?",
        options: [
          "Monthly",
          "Quarterly",
          "Twice a year (April and October)",
          "Once a year"
        ],
        correctAnswer: 2
      },
      {
        question: "Which of the following would help a merchant qualify for lower interchange rates?",
        options: [
          "Manually entering card numbers instead of using chip readers",
          "Batching transactions weekly to reduce processing events",
          "Using Address Verification Service for online transactions",
          "Charging higher transaction amounts"
        ],
        correctAnswer: 2
      },
      {
        question: "What is an effective way to explain interchange fees to merchants?",
        options: [
          "Tell them interchange fees are negotiable if they complain enough",
          "Explain that these fees are the wholesale cost of accepting cards",
          "Recommend they only accept cash to avoid fees entirely",
          "Suggest they add surcharges to all card transactions"
        ],
        correctAnswer: 1
      }
    ]
  }
};

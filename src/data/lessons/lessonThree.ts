
import { LessonContent } from '../types/lessons';

export const lessonThree: LessonContent = {
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
};

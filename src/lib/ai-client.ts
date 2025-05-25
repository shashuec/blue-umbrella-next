/**
 * AI client for portfolio analysis
 * Supports both Azure OpenAI and standard OpenAI
 */
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { isTestMode } from "./supabase";

// Check if we should use mock AI
const useMockAI = () => {
  return isTestMode() || !process.env.AZURE_OPENAI_API_KEY;
};

/**
 * Get an AI client for analyzing portfolios
 * Supports Azure OpenAI or falls back to mock implementation for testing
 */
export async function getAIClient() {
  if (useMockAI()) {
    console.log("Using mock AI client");
    return new MockAIClient();
  }

  try {
    // Set up Azure OpenAI client
    const apiKey = new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY || "");
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-35-turbo";

    console.log("Setting up Azure OpenAI client:");
    console.log("- Endpoint:", endpoint ? "configured" : "missing");
    console.log("- API Version:", apiVersion);
    console.log("- Deployment:", deployment);

    // Create Azure OpenAI client
    return new AzureAIClient(apiKey, endpoint, apiVersion, deployment);
  } catch (error) {
    console.error("Error creating Azure OpenAI client:", error);
    console.log("Falling back to mock AI client");
    return new MockAIClient();
  }
}

/**
 * Azure OpenAI client implementation
 */
class AzureAIClient {
  client: OpenAIClient;
  deployment: string;

  constructor(
    apiKey: AzureKeyCredential, 
    endpoint: string, 
    apiVersion: string, 
    deployment: string
  ) {
    this.client = new OpenAIClient(endpoint, apiKey, { apiVersion });
    this.deployment = deployment;
  }

  /**
   * Analyze portfolio text using Azure OpenAI
   */
  async analyzePortfolio(portfolioText: string) {
    try {
      const messages = [
        {
          role: "system",
          content: `You are a financial advisor specialized in mutual fund portfolio analysis.
          Analyze the provided mutual fund portfolio data and extract key insights.
          Provide a comprehensive analysis including:
          1. Portfolio summary
          2. Current value estimate
          3. Annual return estimate
          4. Risk assessment (Low/Moderate/High)
          5. Number of assets/funds
          6. Asset allocation (Equity, Debt, Cash, Others %)
          7. 4-6 specific recommendations for improvement`
        },
        {
          role: "user",
          content: `Analyze this mutual fund portfolio data: ${portfolioText}`
        }
      ];

      const result = await this.client.getChatCompletions(
        this.deployment,
        messages,
        { temperature: 0.2 }
      );

      const analysisText = result.choices[0].message?.content || "";
      return this.processAnalysisText(analysisText);
    } catch (error) {
      console.error("Error analyzing portfolio with Azure OpenAI:", error);
      throw new Error("Failed to analyze portfolio");
    }
  }

  /**
   * Process analysis text into structured data
   */
  private processAnalysisText(analysisText: string) {
    // Extract structured data from AI response
    let insights = {
      summary: "Analysis unavailable",
      currentValue: 0,
      annualReturn: 0,
      riskLevel: "Unknown",
      assetCount: 0,
      recommendations: [],
      allocation: {
        equity: 0,
        debt: 0,
        cash: 0,
        others: 0
      }
    };
    
    try {
      // Summary - extract a few sentences
      const summaryMatch = analysisText.match(/Portfolio summary:?(.*?)(?:\n\n|\n[A-Z])/is);
      insights.summary = summaryMatch ? summaryMatch[1].trim() : "Analysis completed";
      
      // Current value - look for currency amounts
      const valueMatch = analysisText.match(/current value:?\s*(?:₹|Rs\.?|INR|\$)?[\s]*([0-9,.]+)/i);
      if (valueMatch) {
        insights.currentValue = parseFloat(valueMatch[1].replace(/,/g, ''));
      }
      
      // Annual return - look for percentage
      const returnMatch = analysisText.match(/annual return:?\s*([-+]?[0-9.]+)%/i);
      if (returnMatch) {
        insights.annualReturn = parseFloat(returnMatch[1]);
      }
      
      // Risk level
      if (analysisText.match(/risk:?\s*low/i)) {
        insights.riskLevel = "Low";
      } else if (analysisText.match(/risk:?\s*high/i)) {
        insights.riskLevel = "High";
      } else {
        insights.riskLevel = "Moderate";
      }
      
      // Asset count
      const assetMatch = analysisText.match(/(?:number of assets|funds|holdings):?\s*([0-9]+)/i);
      if (assetMatch) {
        insights.assetCount = parseInt(assetMatch[1]);
      }
      
      // Asset allocation
      const equityMatch = analysisText.match(/equity:?\s*([0-9.]+)%/i);
      if (equityMatch) {
        insights.allocation.equity = parseFloat(equityMatch[1]);
      }
      
      const debtMatch = analysisText.match(/debt:?\s*([0-9.]+)%/i);
      if (debtMatch) {
        insights.allocation.debt = parseFloat(debtMatch[1]);
      }
      
      const cashMatch = analysisText.match(/cash:?\s*([0-9.]+)%/i);
      if (cashMatch) {
        insights.allocation.cash = parseFloat(cashMatch[1]);
      }
      
      const othersMatch = analysisText.match(/others:?\s*([0-9.]+)%/i);
      if (othersMatch) {
        insights.allocation.others = parseFloat(othersMatch[1]);
      }
      
      // Recommendations
      const recommendationsMatch = analysisText.match(/recommendations:?([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i);
      if (recommendationsMatch) {
        const recommendationsText = recommendationsMatch[1];
        const recommendations = recommendationsText
          .split(/\n/)
          .map(line => line.replace(/^[0-9.-]*\s*/, '').trim())
          .filter(line => line.length > 10);
        
        insights.recommendations = recommendations.slice(0, 6);
      }
      
    } catch (extractionError) {
      console.error('Error extracting insights from text:', extractionError);
    }
    
    return insights;
  }
}

/**
 * Mock AI client for testing
 */
class MockAIClient {
  /**
   * Generate mock analysis for testing
   */
  async analyzePortfolio(portfolioText: string) {
    console.log("Using mock AI analysis for text:", portfolioText.substring(0, 100) + "...");
    
    // Return mock analysis
    return {
      summary: "This is a balanced portfolio with a mix of equity and debt funds. The portfolio has shown good performance over the past year with moderate risk.",
      currentValue: 298325,
      annualReturn: 12.5,
      riskLevel: "Moderate",
      assetCount: 3,
      recommendations: [
        "Consider increasing equity allocation for better long-term returns",
        "Rebalance your debt portfolio to include more corporate bonds",
        "Add more diversification with international equity funds",
        "Consider adding a gold ETF for hedging against market volatility",
        "Consolidate overlapping funds to reduce expense ratios",
        "Set up systematic investment plans for regular investments"
      ],
      allocation: {
        equity: 65,
        debt: 25,
        cash: 5,
        others: 5
      }
    };
  }
}

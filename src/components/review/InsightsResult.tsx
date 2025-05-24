"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PortfolioAnalysis } from "@/types/api";

interface InsightsResultProps {
  insights: PortfolioAnalysis;
  onRestart: () => void;
}

export const InsightsResult = ({ insights, onRestart }: InsightsResultProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">Portfolio Analysis Results</h3>
        <p className="mt-2 text-gray-600">{insights.summary}</p>
      </div>

      {/* Portfolio stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-2">
          <h4 className="text-lg font-medium text-gray-700">Portfolio Value</h4>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(insights.currentValue)}
          </p>
        </Card>
        
        <Card className="p-6 space-y-2">
          <h4 className="text-lg font-medium text-gray-700">Annual Return</h4>
          <p className="text-2xl font-bold text-blue-600">
            {insights.annualReturn}%
          </p>
        </Card>
        
        <Card className="p-6 space-y-2">
          <h4 className="text-lg font-medium text-gray-700">Risk Level</h4>
          <p className="text-2xl font-bold text-blue-600">
            {insights.riskLevel}
          </p>
        </Card>
        
        <Card className="p-6 space-y-2">
          <h4 className="text-lg font-medium text-gray-700">Number of Assets</h4>
          <p className="text-2xl font-bold text-blue-600">
            {insights.assetCount}
          </p>
        </Card>
      </div>

      {/* Asset allocation */}
      <Card className="p-6">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Asset Allocation</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Equity</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${insights.allocation.equity}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{insights.allocation.equity}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Debt</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${insights.allocation.debt}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{insights.allocation.debt}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Cash</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-600 rounded-full"
                  style={{ width: `${insights.allocation.cash}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{insights.allocation.cash}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600">Others</span>
            <div className="flex items-center gap-2">
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${insights.allocation.others}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">{insights.allocation.others}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Recommendations</h4>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {insights.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </Card>

      {/* Restart button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onRestart}
          variant="outline"
          className="w-full md:w-auto"
        >
          Analyze Another Portfolio
        </Button>
      </div>
    </div>
  );
};
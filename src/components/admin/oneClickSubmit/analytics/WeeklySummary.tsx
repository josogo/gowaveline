
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import OpenAI from 'openai';

type WeeklySummaryData = {
  total_apps: number;
  approved: number;
  declined: number;
  avg_processing_time: number;
  top_decline_reason: string;
  approval_rate: number;
};

export function WeeklySummary() {
  const [summaryData, setSummaryData] = useState<WeeklySummaryData | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchWeeklySummary = async () => {
    setLoading(true);
    try {
      // Fixed query: Using from() and select() instead of sql()
      const { data, error } = await supabase
        .from('weekly_summary')
        .select('*')
        .maybeSingle(); // Changed from single() to maybeSingle() to prevent errors
      
      if (error) throw error;
      
      if (data) {
        setSummaryData(data);
      }
    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    if (!summaryData) return;

    setLoading(true);
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a business analyst providing a concise, actionable weekly summary of application metrics."
          },
          {
            role: "user",
            content: `Analyze these metrics:
            - Total Applications: ${summaryData.total_apps}
            - Approved Applications: ${summaryData.approved}
            - Declined Applications: ${summaryData.declined}
            - Approval Rate: ${summaryData.approval_rate}%
            - Average Processing Time: ${summaryData.avg_processing_time} minutes
            - Top Decline Reason: ${summaryData.top_decline_reason}

            Write a 2-3 sentence executive summary highlighting key insights and one potential action item.`
          }
        ]
      });

      setAiSummary(response.choices[0].message.content || 'No summary generated.');
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setAiSummary('Unable to generate summary at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklySummary();
  }, []);

  useEffect(() => {
    if (summaryData) {
      generateAISummary();
    }
  }, [summaryData]);

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>📋 Weekly Summary</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchWeeklySummary}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground">Generating summary...</div>
        ) : (
          <div className="space-y-4">
            {summaryData && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Total Applications</h4>
                  <p className="text-2xl font-bold text-blue-800">{summaryData.total_apps}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <h4 className="text-sm font-medium text-green-900 mb-1">Approval Rate</h4>
                  <p className="text-2xl font-bold text-green-800">{summaryData.approval_rate}%</p>
                </div>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="text-sm font-medium text-gray-900 mb-2">AI Insights</h4>
              <p className="text-sm text-gray-700">{aiSummary}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

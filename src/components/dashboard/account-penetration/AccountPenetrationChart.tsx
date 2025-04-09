
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AccountData {
  name: string;
  contacts: number;
  mqls: number;
  sqls: number;
  penetration: number;
}

interface AccountPenetrationChartProps {
  chartData: AccountData[];
}

const AccountPenetrationChart = ({ chartData }: AccountPenetrationChartProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-2 text-xs text-muted-foreground">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>MQLs</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>SQLs</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
          <span>Penetration %</span>
        </div>
      </div>
      
      <div className="h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              barSize={20}
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 10 }}
              />
              <YAxis yAxisId="left" orientation="left" label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Penetration %', angle: 90, position: 'insideRight' }} />
              <Tooltip formatter={(value, name) => {
                if (name === 'penetration') return [`${value}%`, 'Penetration'];
                return [value, name];
              }} />
              <Bar yAxisId="left" dataKey="mqls" name="MQLs" fill="#3B82F6" />
              <Bar yAxisId="left" dataKey="sqls" name="SQLs" fill="#10B981" />
              <Bar yAxisId="right" dataKey="penetration" name="Penetration %" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No account data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPenetrationChart;

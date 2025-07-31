import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ScoreChartProps {
    data: { subject: string; score: number }[];
}

const ScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <defs>
                        <radialGradient id="radarGradient">
                            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#0891b2" stopOpacity={0.1}/>
                        </radialGradient>
                    </defs>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 14 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                    <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#22d3ee"
                        fill="url(#radarGradient)"
                        fillOpacity={0.8}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            borderColor: '#334155',
                            color: '#e2e8f0',
                            borderRadius: '0.5rem',
                        }}
                        formatter={(value: number) => [value.toFixed(2), 'Normalized Score']}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreChart;
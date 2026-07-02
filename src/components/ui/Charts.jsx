"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

import { Line, Bar, Pie, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

ChartJS.defaults.color = '#475569';
ChartJS.defaults.borderColor = '#e2e8f0';
ChartJS.defaults.font.family = 'ui-sans-serif, system-ui, sans-serif';

export { Line, Bar, Pie, Radar };

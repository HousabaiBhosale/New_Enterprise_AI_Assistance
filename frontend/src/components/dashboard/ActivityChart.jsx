import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ActivityChart() {
  const { isLight } = useTheme();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isLight ? '#334155' : '#94a3b8',
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 13, weight: 600 }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.9)',
        titleColor: isLight ? '#0f172a' : '#f8fafc',
        bodyColor: isLight ? '#475569' : '#cbd5e1',
        borderColor: isLight ? 'rgba(203, 213, 225, 0.9)' : 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: isLight ? '#64748b' : '#64748b',
          font: { family: "'Plus Jakarta Sans', sans-serif" }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isLight ? '#64748b' : '#64748b',
          font: { family: "'Plus Jakarta Sans', sans-serif" }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Tasks Resolved',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: isLight ? '#2563eb' : 'rgb(99, 102, 241)',
        backgroundColor: isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(99, 102, 241, 0.2)',
        tension: 0.4,
      },
      {
        fill: true,
        label: 'Approvals Processed',
        data: [28, 48, 40, 19, 86, 27, 90],
        borderColor: isLight ? '#059669' : 'rgb(16, 185, 129)',
        backgroundColor: isLight ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.2)',
        tension: 0.4,
      }
    ],
  };

  return (
    <div style={{ position: 'relative', height: '300px', width: '100%' }}>
      <Line options={options} data={data} />
    </div>
  );
}

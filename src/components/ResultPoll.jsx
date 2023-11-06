import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Title, Legend } from 'chart.js';

// Register the scales and the bar element
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, RadialLinearScale, Title, Legend);

const ResultPoll = ({ topicPoll, selectedChoicesPoll }) => {
  const modernColors = [
    '#1F77B4', '#FF7F0E', '#2CA02C',
    '#D62728', '#9467BD', '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF',
    '#7F97E2', '#FFBC79', '#3B6D8C', '#C86240', '#948BFF', '#D882A7', '#E1D05E', '#81C0C0', '#B5BED7', '#F4866F',
    '#CC2E2E', '#1C1C1C', '#FFD92F', '#98DF8A', '#FF9896', '#C5B0D5', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D',
    '#9EDAE5', '#ACD9E5', '#8C8C8C', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D', '#9EDAE5', '#ACD9E5', '#8C8C8C',
    '#393B79', '#F1D302', '#0ACDFF', '#182A68', '#A0C4FF', '#CC2E2E', '#B5DACA', '#A12A88', '#6A3D9A', '#FD8B25',
    '#FB5072', '#199D8A', '#2B83BA', '#BC5D0A', '#677F95', '#FBA02E', '#D9292B', '#E55896', '#996ED9', '#4775B2',
    '#AABA8E', '#47C4B2', '#D93240', '#DBB6D2', '#A61C74', '#679F46', '#4072A8', '#ADBC88', '#E4E468', '#72D4E5',
    '#9072AF', '#AF79C3', '#2F7D63', '#D1BC46', '#CC6C47', '#8F67B4', '#29A19C', '#A2BBE4', '#DE98AB', '#C9B464',
    '#416ACE', '#DCE4EB', '#F8AF7C', '#E98065', '#F1F6FE', '#8D8D8D', '#E3CE57', '#7F7F7F', '#BCBD22', '#17BECF',
    '#7F97E2', '#FFBC79', '#3B6D8C', '#C86240', '#948BFF', '#D882A7', '#E1D05E', '#81C0C0', '#B5BED7', '#F4866F',
    '#CC2E2E', '#1C1C1C', '#FFD92F', '#98DF8A', '#FF9896', '#C5B0D5', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D',
    '#9EDAE5', '#ACD9E5', '#8C8C8C', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D', '#9EDAE5', '#ACD9E5', '#8C8C8C',
    '#393B79', '#F1D302', '#0ACDFF', '#182A68', '#A0C4FF', '#CC2E2E', '#B5DACA', '#A12A88', '#6A3D9A', '#FD8B25',
    '#FB5072', '#199D8A', '#2B83BA', '#BC5D0A', '#677F95', '#FBA02E', '#D9292B', '#E55896', '#996ED9', '#4775B2',
    '#AABA8E', '#47C4B2', '#D93240', '#DBB6D2', '#A61C74', '#679F46', '#4072A8', '#ADBC88', '#E4E468', '#72D4E5',
    '#9072AF', '#AF79C3', '#2F7D63', '#D1BC46', '#CC6C47', '#8F67B4', '#29A19C', '#A2BBE4', '#DE98AB', '#C9B464',
    '#416ACE', '#DCE4EB', '#F8AF7C', '#E98065', '#F1F6FE', '#8D8D8D', '#E3CE57', '#7F7F7F', '#BCBD22', '#17BECF',
    '#7F97E2', '#FFBC79', '#3B6D8C', '#C86240', '#948BFF', '#D882A7', '#E1D05E', '#81C0C0', '#B5BED7', '#F4866F',
    '#CC2E2E', '#1C1C1C', '#FFD92F', '#98DF8A', '#FF9896', '#C5B0D5', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D',
    '#9EDAE5', '#ACD9E5', '#8C8C8C', '#C49C94', '#F7B6D2', '#C7C7C7', '#DBDB8D', '#9EDAE5', '#ACD9E5', '#8C8C8C',
    '#393B79', '#F1D302', '#0ACDFF', '#182A68', '#A0C4FF', '#CC2E2E', '#B5DACA', '#A12A88', '#6A3D9A', '#FD8B25',
    '#FB5072', '#199D8A', '#2B83BA'
  ];
  const formattedData = selectedChoicesPoll
    ? selectedChoicesPoll.map(item => ({
      choice: item.choice,
      score: parseInt(item.score, 10)
    }))
    : [];
  const labels = formattedData.map(item => item.choice);
  const scores = formattedData.map(item => item.score);

  // Data and options for the Bar chart
  const barData = {
    labels: labels,
    datasets: [
      {
        label: 'จํานวนคนโหวต',
        data: scores,
        backgroundColor: modernColors,
        borderColor: modernColors,
        borderWidth: 2,
        hoverOffset: 4,
        borderRadius: 5,
        barPercentage: 0.7,
      },
    ],
  };

  // Data for the Pie chart
  const totalScore = scores.reduce((acc, score) => acc + score, 0);
  const BarOptions = {
    indexAxis: 'y',
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Maintain aspect ratio for responsiveness
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 16,
            family: 'Arial',
            color: 'black',
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 16,
            family: 'Arial',
            color: 'black',
          },
        },
      },
    },
    plugins: {
    },
    animation: {
      duration: 1000,
      easing: 'easeOut',
      animateRotate: true,
      animateScale: false,
    },
  };

  // Data and options for the Pie chart
  const pieData = {
    labels: labels, // Include percentages in labels
    datasets: [
      {
        label: 'จํานวนคนโหวต',
        data: scores,
        backgroundColor: modernColors,
        borderColor: modernColors,
        borderWidth: 2,
        hoverOffset: 4,
        borderRadius: 5,
      },
    ],
  };

  const PieOptions = {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false, // Maintain aspect ratio for responsiveness
    scales: {
      y: false, // Hide the y-axis
      x: false, // Hide the x-axis
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
            family: 'Arial',
            color: 'black',
          },
        },
      },
      datalabels: { // Add the datalabels configuration
        display: false, // Hide the data labels
      },
      tooltips: {
        enabled: true, // Enable tooltips
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / totalScore) * 100).toFixed(2);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutBounce',
      animateRotate: true,
      animateScale: false,
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: 'white', // You can set the border color here
      },
    },
    // Explicitly set width and height
    width: 600, // Set the desired width
    height: 600, // Set the desired height
  };

  return (
    <div className="flex h-screen bg-white justify-center items-center px-4 sm:px-0 mt-20" style={{ backgroundImage: "url('/images/image 6.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
      <div className="bg-[#DEE9EF] p-20 pt-5 rounded-md w-full sm:w-1/1 md:w-1/2 lg:w-1/3 max-w-3xl shadow-2xl">
        <div className="flex-col font-junge">
          <p className="text-5xl font-thin mb-5 pt-5">Result</p>
          <div className='text-2xl align-left p-3'>
            Title: {topicPoll.title}
          </div>
          <div className='text-2xl align-left p-3'>
            Description: {topicPoll.description}
          </div>
          <div className="p-4">
            <Bar key={"voteBarChart"} data={barData} options={{
              ...BarOptions, plugins: {
                legend: {
                  display: false, // Hide the legend
                },
                datalabels: {
                  color: 'white',
                  anchor: 'end',
                  align: 'start',
                  offset: 4,
                  font: {
                    size: 20,
                    family: 'junge',
                  },
                  formatter: (value, context) => {
                    const percentage = ((value / totalScore) * 100).toFixed(2);
                    return `${percentage}%`;
                  },
                },
              },
            }} />
          </div>
          <div className="p-4">
            <Pie data={pieData} options={{
              ...PieOptions, plugins: {
                datalabels: {
                  color: 'white',
                  anchor: 'end',
                  align: 'start',
                  offset: 30,
                  font: {
                    size: 28,
                    family: 'junge',
                  },
                  formatter: (value, context) => {
                    const percentage = ((value / totalScore) * 100).toFixed(2);
                    return `${percentage}%`;
                  },
                },
              },
            }}
              style={{ width: '400px', height: '400px' }} />
          </div>

          <div className='flex justify-center items-center'>
            {/* <div className='w-1/2'>
              <Button type="primary" htmlType="submit" className="login-form-button pt-5 pb-5 flex justify-center items-center">
                <div className='font-junge text-xl'>Submit</div>
              </Button>
            </div> */}
          </div>
          <div className='flex justify-end font-junge text-xl' >
            Poll By {topicPoll.name}
          </div>
          {/* Other Form Components can be added here as per your needs */}
        </div>
      </div>
    </div>
  );
};

export default ResultPoll;

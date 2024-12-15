import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import {
  Wrapper,
  Title,
  ChartContainer,
  LoadingMessage,
  Dropdown,
  Tabs,
  Tab,
  GlobalStyle, // Import GlobalStyle here
} from './analytics.styled';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const Analytics = () => {
   const [cityData, setCityData] = useState([]);
   const [cuisineData, setCuisineData] = useState([]);
   const [sentimentData, setSentimentData] = useState([]);
   const [checkinData, setCheckinData] = useState([]); // New state for check-in data
   const [topCitiesData, setTopCitiesData] = useState([]); // New state for top cities data
   const [cities, setCities] = useState([]);
   const [selectedCity, setSelectedCity] = useState('');
   const [loadingCityData, setLoadingCityData] = useState(true);
   const [loadingCuisineData, setLoadingCuisineData] = useState(false);
   const [loadingSentimentData, setLoadingSentimentData] = useState(true);
   const [loadingCheckinData, setLoadingCheckinData] = useState(true); // New state for check-in data loading
   const [loadingTopCities, setLoadingTopCities] = useState(true); // New state for top cities data loading
   const [cityDataError, setCityDataError] = useState(null);
   const [cuisineDataError, setCuisineDataError] = useState(null);
   const [sentimentDataError, setSentimentDataError] = useState(null);
   const [checkinDataError, setCheckinDataError] = useState(null); // New state for check-in data error
   const [topCitiesError, setTopCitiesError] = useState(null); // New state for top cities data error
   const [activeTab, setActiveTab] = useState('happiestCity'); // Tabs: 'happiestCity', 'cuisineChart', 'sentimentChart', 'checkinChart', 'topCitiesChart'

  // Fetch happiest city data
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const response = await fetch('http://localhost:8080/happiest-city');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCityData(data);
      } catch (err) {
        console.error('Error fetching happiest city data:', err);
        setCityDataError('Failed to load happiest city data. Please try again later.');
      } finally {
        setLoadingCityData(false);
      }
    };

    fetchCityData();
  }, []);

  // Fetch unique cities for dropdown
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch('http://localhost:8080/getUniqueCities');
        if (!response.ok) {
          throw new Error(`Failed to fetch cities`);
        }
        const data = await response.json();
        setCities(data.cities);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCuisineDataError('Failed to load cities.');
      }
    };

    fetchCities();
  }, []);

  // Fetch cuisine percentage data for the selected city
  const fetchCuisinesPercentage = async (city) => {
    setLoadingCuisineData(true);
    try {
      const response = await fetch(`http://localhost:8080/getCuisinePercentages?city=${city}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cuisine percentages for ${city}`);
      }
      const data = await response.json();
      setCuisineData(data);
    } catch (err) {
      console.error('Error fetching cuisine percentages:', err);
      setCuisineDataError('Failed to load cuisine data. Please try again later.');
    } finally {
      setLoadingCuisineData(false);
    }
  };

  // Fetch sentiment data
  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        const response = await fetch('http://localhost:8080/sentiment-distribution');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSentimentData(data);
      } catch (err) {
        console.error('Error fetching sentiment distribution:', err);
        setSentimentDataError('Failed to load sentiment distribution. Please try again later.');
      } finally {
        setLoadingSentimentData(false);
      }
    };

    fetchSentimentData();
  }, []);

   useEffect(() => {
      const fetchCheckinData = async () => {
      try {
         const response = await fetch('http://localhost:8080/weekly-checkin-distribution');
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         console.log('Weekly check-in data:', data); // Debug log
         setCheckinData(data);
      } catch (err) {
         console.error('Error fetching weekly check-in distribution:', err);
         setCheckinDataError('Failed to load weekly check-in distribution. Please try again later.');
      } finally {
         setLoadingCheckinData(false);
      }
      };
   
      fetchCheckinData();
   }, []);

   useEffect(() => {
      const fetchTopCitiesData = async () => {
        try {
          const response = await fetch('http://localhost:8080/top-cities-diverse-high-rated-restaurants');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Top Cities Data:', data); // Debug log
          setTopCitiesData(data); // Update state
        } catch (error) {
          console.error('Error fetching top cities data:', error);
          setTopCitiesError('Failed to load top cities data. Please try again later.');
        } finally {
          setLoadingTopCities(false);
        }
      };
    
      fetchTopCitiesData();
    }, []);    

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    if (city) {
      fetchCuisinesPercentage(city);
    }
  };

   const groupedBarChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Weekdays
      datasets: checkinData.reduce((datasets, item) => {
      const restaurantDataset = datasets.find((d) => d.label === item.restaurant_name);
      if (!restaurantDataset) {
         datasets.push({
            label: item.restaurant_name,
            data: Array(7).fill(0), // Initialize for 7 days
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random colors
         });
      }
      const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(item.checkin_weekday);
      datasets.find((d) => d.label === item.restaurant_name).data[dayIndex] = item.total_checkins;
      return datasets;
      }, []),
   };
   

   const groupedBarChartOptions = {
      responsive: true,
      plugins: {
      legend: {
         position: 'top',
      },
      tooltip: {
         callbacks: {
            label: (tooltipItem) => `${tooltipItem.raw} check-ins`,
         },
      },
      },
      scales: {
      x: {
         title: {
            display: true,
            text: 'Weekdays',
         },
      },
      y: {
         title: {
            display: true,
            text: 'Number of Check-ins',
         },
         beginAtZero: true,
      },
      },
   };
 
  // Prepare happiest city bar chart data
  const barChartData = {
    labels: cityData.map((item) => item.city),
    datasets: [
      {
        label: 'Average Star Rating',
        data: cityData.map((item) => item.average_star_rating),
        backgroundColor: '#4caf50',
        hoverBackgroundColor: '#388e3c',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => {
            const value = parseFloat(tooltipItem.raw);
            return `${value.toFixed(2)} stars`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Cities',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Star Rating',
        },
        beginAtZero: true,
        max: 5,
      },
    },
  };
  

  // Prepare cuisine pie chart data
  const pieChartData = {
    labels: cuisineData.map((item) => item.cuisine),
    datasets: [
      {
        data: cuisineData.map((item) => item.percentage),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  const horizontalBarChartData = {
   labels: topCitiesData.map((item) => item.city), // Dynamic city names
   datasets: [
     {
       label: 'Number of Restaurants',
       data: topCitiesData.map((item) => item.num_restaurants), // Number of restaurants
       backgroundColor: '#FFCE56', // Customize color
       hoverBackgroundColor: '#FF9F40', // Hover effect
     },
   ],
 };
 
 const horizontalBarChartOptions = {
   indexAxis: 'y', // Switch to horizontal bar
   responsive: true,
   plugins: {
     legend: {
       display: false, // Hide legend for simplicity
     },
   },
   scales: {
     x: {
       title: {
         display: true,
         text: 'Number of Restaurants',
       },
       beginAtZero: true,
     },
     y: {
       title: {
         display: true,
         text: 'Cities',
       },
     },
   },
 }; 
 
  // Prepare sentiment stacked bar chart data
  const sentimentChartData = {
    labels: sentimentData.map((item) => item.restaurant_name),
    datasets: [
      {
        label: 'Dislikes',
        data: sentimentData.map((item) => item.num_dislikes),
        backgroundColor: '#f44336',
      },
      {
        label: 'Neutral',
        data: sentimentData.map((item) => item.num_neutral),
        backgroundColor: '#ffc107',
      },
      {
        label: 'Loves',
        data: sentimentData.map((item) => item.num_loves),
        backgroundColor: '#4caf50',
      },
    ],
  };

  const sentimentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Restaurants',
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Number of Users',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <GlobalStyle /> {/* Apply the global style */}
      <Wrapper>
        <Tabs>
          <Tab
            active={activeTab === 'happiestCity'}
            onClick={() => setActiveTab('happiestCity')}
          >
            Happiest City
          </Tab>
          <Tab
            active={activeTab === 'cuisineChart'}
            onClick={() => setActiveTab('cuisineChart')}
          >
            Cuisine Distribution
          </Tab>
          <Tab
            active={activeTab === 'sentimentChart'}
            onClick={() => setActiveTab('sentimentChart')}
          >
            Sentiment Analysis
          </Tab>
          <Tab
            active={activeTab === 'checkinChart'}
            onClick={() => setActiveTab('checkinChart')}
          >
            Weekly Check-ins
         </Tab>
         <Tab
            active={activeTab === 'topCitiesChart'}
            onClick={() => setActiveTab('topCitiesChart')}
         >
            Top Cities
         </Tab>
        </Tabs>

        {activeTab === 'happiestCity' && (
          <>
            <Title>Happiest City</Title>
            {loadingCityData ? (
              <LoadingMessage>Loading city data...</LoadingMessage>
            ) : cityDataError ? (
              <LoadingMessage>{cityDataError}</LoadingMessage>
            ) : (
              <ChartContainer>
                <Bar data={barChartData} options={barChartOptions} />
              </ChartContainer>
            )}
          </>
        )}

        {activeTab === 'cuisineChart' && (
          <>
            <Title>Select a City to View Cuisine Distribution</Title>
            <Dropdown onChange={handleCityChange} value={selectedCity}>
              <option value="">Select a City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Dropdown>
            {loadingCuisineData ? (
              <LoadingMessage>Loading cuisine data...</LoadingMessage>
            ) : cuisineDataError ? (
              <LoadingMessage>{cuisineDataError}</LoadingMessage>
            ) : (
              selectedCity &&
              cuisineData.length > 0 && (
                <ChartContainer small>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </ChartContainer>
              )
            )}
          </>
        )}

        {activeTab === 'sentimentChart' && (
          <>
            <Title>Sentiment Distribution Across Top 10 Restaurants</Title>
            {loadingSentimentData ? (
              <LoadingMessage>Loading sentiment data...</LoadingMessage>
            ) : sentimentDataError ? (
              <LoadingMessage>{sentimentDataError}</LoadingMessage>
            ) : (
              <ChartContainer>
                <Bar data={sentimentChartData} options={sentimentChartOptions} />
              </ChartContainer>
            )}
          </>
        )}
        {activeTab === 'checkinChart' && (
         <>
            <Title>Weekly Check-in Distribution (Top 5 Restaurants)</Title>
            {loadingCheckinData ? (
               <LoadingMessage>Loading weekly check-in data...</LoadingMessage>
            ) : checkinDataError ? (
               <LoadingMessage>{checkinDataError}</LoadingMessage>
            ) : (
               <ChartContainer>
               <Bar data={groupedBarChartData} options={groupedBarChartOptions} />
               </ChartContainer>
            )}
         </>
         )}
         {activeTab === 'topCitiesChart' && (
         <>
            <Title>Top 5 Cities with the Most Diverse and Highly Rated Restaurants</Title>
            {loadingTopCities ? (
               <LoadingMessage>Loading top cities data...</LoadingMessage>
            ) : topCitiesError ? (
               <LoadingMessage>{topCitiesError}</LoadingMessage>
            ) : (
               <ChartContainer>
               {/* Updated to use horizontalBarChartData */}
               <Bar data={horizontalBarChartData} options={horizontalBarChartOptions} />
               </ChartContainer>
            )}
         </>
         )}
      </Wrapper>
    </>
  );
};

export default Analytics;
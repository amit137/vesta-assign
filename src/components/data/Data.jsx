import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from 'react-apexcharts';
import './data.css'

const Data = () => {
  const [data, setData] = useState([]);
  const [uniqueDepartment,setUniqueDepartment]=useState([])
  const [hotelCounts, setHotelCounts] = useState({});

  const fetchData = async () => {
    const res = await axios.get("https://checkinn.co/api/v1/int/requests");
    setData(res.data.requests);
  };

  const dataFiltering = (data) => {
    return data.reduce((acc, d) => {
      const hotelName = d.hotel.name;
      acc[hotelName] = (acc[hotelName] || 0) + 1;
      return acc;
    }, {});
  };

  const departmentFiltering=data=>{
    data.forEach((d)=>{
        if(!uniqueDepartment.includes(d.desk.name)){
            uniqueDepartment.push(d.desk.name)
        }
    })
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const counts = dataFiltering(data);
      setHotelCounts(counts);
      departmentFiltering(data)
    }
  }, [data]);

  const chartData = {
    options: {
      chart: {
        id: "basic-line",
        toolbar: {
            show: false
          },
      },
     
      xaxis: {
        categories: Object.keys(hotelCounts)
      },
      yaxis: {
        min: 0,
        max: 8,
        tickAmount: 5
      }
    },
    series: [
      {
        name: "Requests",
        data: Object.values(hotelCounts)
      }
    ]
  };

  return (
    <div className="data">
      <div className="container">
        <h2>Requests per Hotel</h2>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          width="500"
        />
        <p>Total requests : {data.length}</p>
        <p>List of <i>unique</i> department names across all Hotels: {uniqueDepartment.map((d, index) => (
  <span key={index}>{d}{index !== uniqueDepartment.length - 1 ? ', ' : ''}</span>
))}</p>

      </div>
    </div>
  );
};

export default Data;

import React, { useEffect, useContext, useState } from 'react';

import { Card , Spin} from 'antd';
import { UserContext } from './UserContext';
import { useNavigate } from "react-router-dom";

const History = () => {
  const { user, setUser } = useContext(UserContext);
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/topics/email/' + user.email);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      if (data.success && data.topics) {
        console.log(data.topics)
        setTopics(data.topics);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  }
  const x = [1, 2, 3, 4, 5, 5, 5]
  useEffect(() => {
    const intervalHistory = setInterval(fetchTopics, 1000)
    return () => clearInterval(intervalHistory);
  }, [])
  if (loading) {
    return <div className='flex justify-center items-center center bg-[#DEE9EF] h-screen mt-20'><Spin size="large" tip="Loading..." /></div>;
  }
  else {
    return (
      <div className="flex justify-center bg-[#DEE9EF] h-screen mt-20 font-junge">
        <div className='bg-[#FFFFFF] w-3/5 p-5 mt-10'>
          <p className="text-5xl font-thin mb-5">Vote History</p>
          <div className='flex flex-wrap'>
            {topics.map((topic, idx) => (
              <Card
                hoverable
                style={{}}
                key={topic.id}
                cover={<img alt="example" src={topic.image} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />}
                onClick={() => { navigate(`/results/${topic.id}`); }}
                className='m-2 lg:w-1/6 md:w-1/3 bg-[#0b101c] text-white'
              >
                <p>Title : {topic.title}</p>
                <p>You Voted For : {topic.choices.filter((choice) => choice.voters.includes(user.email)).map((choice,ind)=>ind==0?`${choice.choice}`:`, ${choice.choice}`)}</p>

              </Card>
            ))}

          </div>



        </div>
      </div>
    );
  }
};

export default History;
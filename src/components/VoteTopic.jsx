import React, { useEffect, useState, useContext, useMemo  } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

const VoteTopic = ({ location, setTopics1 }) => {

  // console.log(topics)  
  const { user, setUser } = useContext(UserContext);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log('Logged in user email:', user.email);
  // console.log('Filtered topics:', filteredTopics);
  // console.log(' topics:', topics);
  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/topics');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      if (data.success && data.topics) {
        setTopics(data.topics);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = useMemo(
    () => topics.filter(topic => topic.createdBy === user.email),
    [topics, user.email]
  );

  useEffect(() => {
    const intervalId = setInterval(fetchTopics, 200); // Fetch topics every 30 seconds
    return () => clearInterval(intervalId); // Clear interval when component unmounts
}, []);

  // console.log(topics[0].createdBy)
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#20414F] font-junge">
      <div>
        <Link to="/create">
          <button className="text-[32px] h-[20px] text-[#00B6DE] pt-[150px] btn-new-vote">
            <div
              className="[flex-grow:1] w-[3/5] bg-[#20414F] border-[3px] border-[#00B6DE] rounded-[11px] px-[27px] border-solid flex justify-center items-center py-4"
            >
              New Vote
            </div>
          </button>
        </Link>
      </div>
      <div className="flex mt-20 flex-col w-full divide-y divide-[#00B6DE] p-5">
        {loading ? (
          <div className="flex text-white justify-center items-center">Loading...</div>  // Show loading indicator
        ) : filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => (
            setTopics1(filteredTopics),
            <Link to={`/vote/${topic.id}`} key={index} className="flex justify-center items-center text-[#FFFFFF] py-3 w-full">
              {topic.title}
            </Link>
          ))
        ) : (
          <div className="flex text-white justify-center items-center">No topics available. Please create one.</div>
        )}
      </div>
    </div>
  );
};

export default VoteTopic;

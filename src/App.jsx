import React, { useState, useContext, useEffect } from 'react';
import { Modal } from 'antd';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import CreateVote from './components/CreateVote';
import VoteTopic from './components/VoteTopic';
import Navbar from './components/Navbar';
import Vote from './components/Vote';
import Result from './components/Result';
import Register from './components/Register'
import Login from './components/Login';
import Join from './components/Join';
import Feedback from './components/Feedback';
import Poll from './components/Poll'
import { UserContext } from './components/UserContext';
import ResultPoll from './components/ResultPoll';
import Home from './components/Home';
import History from './components/History';
const Layout = ({ topics,setTopics1, addVoteTopic, castVote }) => {
  const { user } = useContext(UserContext);

  if (user) {
    return (
      <div className="container1 flex font-junge bg-[#20414F] mt-20">
        <div className="sidebar w-1/5 bg-[#20414F] flex flex-col">
          <VoteTopic setTopics1={setTopics1}/>
        </div>
        <div className="main-content w-4/5 bg-[#DEE9EF] pb-4 z-3 ">
          <Outlet />
        </div>
      </div>
    );
  } else {
    return <>
    <Home />
    </>;
  }
};

const App = () => {
  const [topics, setTopics] = useState([]);
  const [topics1, setTopics1] = useState([]);
  const [results, setResults] = useState([]);
  const [topicPoll, setTopicPoll] = useState([]);
  const [selectedChoicesPoll, setSelectedChoicesPoll] = useState([]);
  const [pinFromJoin, setPinFromJoin] = useState();
  const [user, setUser] = useState(null);
  // console.log(pin);
  const addVoteTopic = (newTopic) => {
    const updatedTopics = [...topics, newTopic];
    setTopics(updatedTopics);
  };

  const castVote = (topicId, candidateId) => {
    setTopics(
      topics.map((topic, index) =>
        index === topicId
          ? {
            ...topic,
            candidates: topic.candidates.map((candidate, i) =>
              i === candidateId ? { ...candidate, votes: (candidate.votes || 0) + 1 } : candidate
            ),
          }
          : topic
      )
    );
  };
  React.useEffect(() => {
    const savedUserData = JSON.parse(localStorage.getItem('user'));
    if (savedUserData) {
      const currentTime = Date.now();
      const oneHour = 60 * 60 * 1000;  // 1 hour in milliseconds
      if (currentTime - savedUserData.timestamp >= oneHour) {
        // An hour has passed since the user data was saved; clear it from localStorage
        localStorage.removeItem('user');
        setUser(null);
        Modal.warning({
          title: 'Session Timeout',
          content: 'Your session has timed out due to inactivity. Please log in again.',
        });
      } else {
        // Less than an hour has passed; load the user data
        setUser(savedUserData.user);
      }
    }
  }, []);
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <Navbar isLoginScreen={true} />
        <Routes>
          <Route path="/" element={<Layout setTopics1={setTopics1} topics={topics} addVoteTopic={addVoteTopic} castVote={castVote} />}>
            <Route path="/create" element={<CreateVote addVoteTopic={addVoteTopic} topics={topics} />} />
            <Route path="/vote/:topicId" element={<Vote topics1={topics1} castVote={castVote} />} />
          </Route>
          <Route index element={<Home />} />
          <Route path="/results/:topicId" element={<Result />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/vote-link/:linkId" element={<Join setTopicPoll={setTopicPoll} setPinFromJoin={setPinFromJoin}/>} />
          <Route path="/poll/:topicId" element={<Poll topicPoll={topicPoll} pinFromJoin={pinFromJoin} setSelectedChoicesPoll={setSelectedChoicesPoll} />} />
          <Route path="/resultPoll/:topicId" element={<ResultPoll topicPoll={topicPoll} selectedChoicesPoll={selectedChoicesPoll} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/history' element={<History/>}/>
        </Routes>
      </UserContext.Provider>

    </Router>

  );
};

export default App;

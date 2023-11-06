import React, { useState, useEffect,useContext } from 'react';
import { Form, Input, Button, Checkbox, Alert, Image, Radio, Modal, Spin } from 'antd';  // Note the Radio import here
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Navbar from "./Navbar"
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from './UserContext';
const Poll = ({ topicPoll, setSelectedChoicesPoll, pinFromJoin }) => {
    const { topicId } = useParams();
    const [error, setError] = useState(null);
    const [selectedChoices, setSelectedChoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const blobToBase64 = async (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    useEffect(() => {
        if (topicPoll.image && typeof topicPoll.image === 'string' && topicPoll.image.startsWith('blob:')) { // Only fetch if it's a URL
            fetch(topicPoll.image)
                .then(response => response.blob())
                .then(async blob => {
                    const base64Image = await blobToBase64(blob);
                    localStorage.setItem(`topicPollImage-${topicId}`, base64Image);
                })
                .catch(err => {
                    console.error('Error fetching or storing image:', err);
                });
        }
    }, [topicPoll.image, topicId]);
    // Retrieve image from local storage if available
    const localImage = localStorage.getItem(`topicPollImage-${topicId}`) || topicPoll.image;
    const navigate = useNavigate();
 
    async function castVote(topicId, choices, pin, invitationType, voteTime) {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await fetch('http://localhost:3001/api/vote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topicId, userEmail: user.email, choices, pin, invitationType, voteTime }),
            });
            const data = await response.json();
            if (!data.success) {
              throw new Error(data.error);
            }
            resolve(data); // Resolve the promise when the vote is cast successfully
          } catch (error) {
            console.error("Error casting vote:", error);
            reject(error); // Reject the promise on error
          }
        });
      }
      
      const onFinish = async (values) => {
        setLoading(true);
        setError(null); // Clear any existing errors
        try {
          console.log('Attempting to cast vote for choice:', selectedChoices);
      
          await castVote(topicId, selectedChoices, pinFromJoin, topicPoll.invitationType, new Date().toLocaleString() + "");
      
          // Now fetch the updated topic data only after the vote has been confirmed
          const response = await fetch(`http://localhost:3001/api/topic/${topicPoll.id}`);
          const updatedTopicData = await response.json();
          if (updatedTopicData.success && updatedTopicData.topic) {
            const allChoices = updatedTopicData.topic.choices;
            setSelectedChoicesPoll(allChoices); // Update the state with the new choices
          } else {
            throw new Error(updatedTopicData.error || 'Unknown error occurred');
          }
      
          navigate(`/resultPoll/${topicPoll.id}`);
        } catch (error) {
          console.error("Error during voting process:", error);
          setError(error.message || "An error occurred during the voting process.");
        } finally {
          setLoading(false);
        }
      };
      
    const onCheckboxChange = (checkedValues) => {
        if (topicPoll.ballotType === "single" && checkedValues.length > 1) {
            // Only keep the last selected choice if ballot type is "single"
            checkedValues = [checkedValues[checkedValues.length - 1]];
        }
        setSelectedChoices(checkedValues);
    };

    const renderChoices = () => {
        if (topicPoll.ballotType === "single") {
            return (
                <Radio.Group style={{ width: '100%' }} onChange={e => setSelectedChoices([e.target.value])} className="flex-col shadow-2xl bg-[#FFFFFF] p-10 bg-opacity-60 rounded-md overflow-y-auto h-[250px]">
                    {topicPoll.choices && topicPoll.choices.map((choiceObj, index) => (
                        <div key={index}>
                            <Radio value={choiceObj.choice} className='pb-5 text-2xl font-junge'>{index + 1}. {choiceObj.choice}</Radio>
                        </div>
                    ))}
                </Radio.Group>
            );
        } else if (topicPoll.ballotType === "multiple") {
            return (
                <Checkbox.Group style={{ width: '100%' }} className="flex-col shadow-2xl bg-[#FFFFFF] p-10 bg-opacity-60 rounded-md " onChange={onCheckboxChange}>
                    {topicPoll.choices && topicPoll.choices.map((choiceObj, index) => (
                        <div key={index} className=''>
                            <Checkbox value={choiceObj.choice} className='pb-5 text-2xl font-junge'>{index + 1}. {choiceObj.choice}</Checkbox>
                        </div>
                    ))}
                </Checkbox.Group>
            );
        }
    };

    return (
        <Form
            name="normal_login"
            className=""
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >
            <div className="flex h-screen bg-white justify-center items-center px-4 sm:px-0 mt-20" style={{ backgroundImage: "url('/images/image 6.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                <div className="bg-[#DEE9EF] p-10 rounded-md w-full sm:w-1/1 md:w-1/2 lg:w-1/3 max-w-3xl shadow-2xl">
                    {error && <Alert message={error} type="error" closable />}
                    <div className="flex-col font-junge">
                        {error && <Alert message={error} type="error" closable />}
                        <div className='flex justify-center items-center pb-10 ' >
                            {localImage && <Image src={localImage} width="400px" className='rounded-lg' />}
                        </div>

                        <div className='text-2xl align-left p-3'>
                            Title: {topicPoll.title}
                        </div>
                        <div className='text-2xl align-left p-3'>
                            Description: {topicPoll.description}
                        </div>
                        <Form.Item
                            name="selectedChoices"
                            rules={[{ required: true, message: 'Please Select your Choices!' }]}
                            labelCol={{ span: 24 }}
                        >
                            <div className='text-2xl align-left flex-col p-10'>
                                {renderChoices()}
                            </div>
                        </Form.Item>
                        <div className='flex justify-center items-center'>
                            <div className='w-1/2'>
                                <Button type="primary" htmlType="submit" className="login-form-button pt-5 pb-5 flex justify-center items-center">
                                    <div className='font-junge text-xl'>Submit</div>
                                </Button>
                            </div>
                        </div>
                        <div className='flex justify-end font-junge text-xl' >
                            Poll By {topicPoll.name}
                        </div>
                        {/* Other Form Components can be added here as per your needs */}
                    </div>
                </div>
            </div>
            <Modal
                title="Waiting to Confirm Transaction"
                visible={loading}  // Set the visibility of the loading modal based on the loading state
                footer={null}  // No footer buttons
                closable={false}  // Modal should not be closable
                centered  // This prop centers the modal vertically
                bodyStyle={{ textAlign: 'center', padding: '24px' }}  // Center text and add padding
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',  // Stack the elements vertically
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '150px'  // Fixed height to ensure centering
                }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px', fontSize: '16px', fontWeight: 'bold' }}>
                        Processing...
                    </div>
                </div>
            </Modal>
        </Form>
    );
};

export default Poll;

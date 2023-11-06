import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";

const Join = ({ setTopicPoll, setPinFromJoin }) => {
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState({});
  const { linkId } = useParams();

  // console.log(topicData)
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/topic/${linkId}`);
        const data = await response.json();
        if (data.success && data.topic) {
          setTopic(data.topic);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };

    fetchTopic();
  }, [linkId]);  // Dependency array updated to include linkId
  const onFinish = (values) => {
    // for (let i = 0; i < topics.length; i++) {
    //     if (linkId === topics[i].id) { // Use the `id` property to match linkId
    //         const hasPin = topics[i].pins.includes(values.password.trim());
    //         if (hasPin) {
    //             console.log(topics[i])
    //             console.log(topics[i].id);
    //             setTopicPoll(topics[i]);
    //             setPinFromJoin(values.password);
    //             navigate(`/poll/${topics[i].id}`);
    //             return; // exit the function once the topic is found
    //         } else {
    //             setError("Incorrect PIN");
    //         }
    //     }
    // }
    console.log(topic, topic.invitationType)
    let userStored = localStorage.getItem('user');
    let userEmail = userStored ? JSON.parse(userStored).user.email : null;
    if (userEmail) {
      if (topic.invitationType === "pincode") {
        const voteKeys = topic.pin.filter(item => item.voteWeight == 1).map(item => item.voteKey);
        console.log(topic.pin, values.password)
        const hasPin = voteKeys.includes(values.password.trim());
        console.log(voteKeys)
        const checkEmail = topic.pin.filter(item => item.votedBy == userEmail).map(item => item.votedBy);
        // console.log(checkEmail, checkEmail.length > 0)
        if (hasPin && !checkEmail.length > 0) {
          console.log(topic);
          console.log(topic);
          setTopicPoll(topic);
          setPinFromJoin(values.password);
          navigate(`/poll/${topic.id}`);
          return; // exit the function once the topic is found
        } else {
          setError("Incorrect PIN");
        }

      } else {
        console.log("email cond");

        // Correctly retrieve the user email from localStorage

        userEmail = userEmail.trim(); // remove whitespace

        // Retrieve the user's input PIN
        let inputPin = values.password.trim();

        console.log('User email from storage:', userEmail);
        console.log('User entered PIN:', inputPin);
        console.log('Email List:', topic.emailList);

        // Find the user in the email list that matches both the email and has a valid PIN
        let validUser = topic.emailList.find(item =>
          item.email === userEmail &&
          item.voteKey === inputPin &&
          Number(item.voteWeight) === 1  // Ensure that voteWeight is compared as a number
        );

        if (validUser) {
          console.log('Valid user found:', validUser);
          console.log(topic);
          setTopicPoll(topic);
          setPinFromJoin(values.password);
          navigate(`/poll/${topic.id}`);
          return; // exit the function once the topic is found
        } else {
          console.error('No matching user found in the email list.');
          setError("Incorrect PIN or It not your key");
        }


      }
    } else {
      setError("You must login first");
      console.error('No user data found in localStorage');
    }
  };

  return (
    <div
      className="flex h-screen bg-white justify-center items-center px-4 sm:px-0 mt-20"
      style={{
        backgroundImage: "url('/images/image 6.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-[#DEE9EF] p-10 rounded-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xl">
        <img src="/images/Group 2055.png" className="" />
        <div>
          {error && <Alert
            message={error}
            type="error"
            closable
            onClose={() => setError(null)}
          />}
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Enter Your Pin Code"
              name="password"
              rules={[{ required: true, message: "Please Enter your Pin!" }]}
              labelCol={{ span: 24 }}
            >
              <Input type="password" placeholder="Enter Your Pin Code" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button pt-5 pb-5 flex justify-center items-center"
              >
                <div className="font-junge text-xl">Join Poll</div>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Join;

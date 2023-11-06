import React,{useEffect, useContext} from 'react';
import { HeartFilled } from '@ant-design/icons';
import { Form, Input, Button, message, Rate, Typography } from 'antd';
import { UserContext } from './UserContext';


const Feedback = () => {
    const [form] = Form.useForm();
    const { user, setUser } = useContext(UserContext);
    let userName = user ? `${user.firstName} ${user.lastName}` : '';
    useEffect(() => {
        // Set the initial value when the component is mounted
        form.setFieldsValue({
            name: userName,
        });
    }, []); 
    const onFinish = async (values) => {
        try {
            const response = await fetch('http://localhost:3001/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            message.success('Feedback submitted successfully! Thank you for your input.');
            form.resetFields();
        } catch (error) {
            message.error(error.message || 'Failed to submit feedback');
        }
    };

    return (
        <div className="h-screen flex justify-center bg-gray-100 mt-20">
            <Form 
                form={form} 
                name="feedback" 
                onFinish={onFinish} 
                autoComplete="off" 
                className="bg-white p-8 rounded shadow-md w-[600px] h-[800px] mt-10"
                initialValues={{ name: userName }}
            >
                <p className="text-5xl font-junge mb-6 text-center">Feedback</p>
                <Form.Item
                    name="name"
                    label="Name"
                    values={userName}
                >
                    <Typography>
                        {userName}
                    </Typography>
                </Form.Item>

                <Form.Item
                    label="Score"
                    name="score"
                    rules={[{ required: true, message: 'Please rate!' }]}
                >
                    <Rate character={<HeartFilled />} style={{color:"red"}}/>
                </Form.Item>
 
                <Form.Item
                    name="feedback"
                    rules={[{ required: true, message: 'Please input your feedback!' }]}
                >
                    <Input.TextArea placeholder="Feedback" allowClear className="rounded" />
                </Form.Item>

                <Form.Item className="text-center">
                    <Button type="primary" htmlType="submit" className="w-full">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Feedback;
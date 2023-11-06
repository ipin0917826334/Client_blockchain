import React from 'react';
import { Steps } from 'antd';

const { Step } = Steps;

const VoteSteps = ({ stepNow }) => {
  return (
    <Steps current={stepNow} className='pl-5 pr-5 pb-5'>
      <Step title="Create Vote" description="Create Your Vote." />
      <Step title="Voting" description="View Detail" />
    </Steps>
  );
};

export default VoteSteps;

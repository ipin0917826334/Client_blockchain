import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Input, message, Image, Modal } from "antd";
import html2pdf from "html2pdf.js";
import { CopyOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
import VoteSteps from "./VoteSteps";
import "jspdf-autotable";
const Vote = ({ topics, castVote, topics1 }) => {
  const navigate = useNavigate();
  // const [pin, setPin] = useState([]);
  let topic = {};
  const { topicId } = useParams();
  for (var i = 0; i < topics1.length; i++) {
    if (topics1[i].id === topicId) {
      // setTopic(topics1[i]);
      // console.log(topics1[i].id)
      topic = topics1[i];
    }
  }
  const blobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  const showResults = () => {
    // Calculate the sum of scores
    const sumOfScores = topic.choices.reduce((sum, choice) => sum + choice.score, 0);
    console.log(sumOfScores)
    // console.log(sumOfScores)
    if (sumOfScores === "0000") {
      // Show alert if the sum is 0
      Modal.warning({
        title: 'No Votes',
        content: 'No one has voted yet!',
      });
    } else {
      // Navigate to results page if the sum is not 0
      navigate(`/results/${topic.id}`);
    }
  };
  useEffect(() => {
    // console.log("KKK")
    // console.log("bool", topic.image,!!topic.image, typeof topic.image === 'string', topic.image.startsWith('blob:'))
    if (
      topic.image &&
      typeof topic.image === "string" &&
      topic.image.startsWith("blob:")
    ) {
      // Only fetch if it's a URL
      // console.log("immg", topic.image);
      fetch(topic.image)
        .then((response) => response.blob())
        .then(async (blob) => {
          const base64Image = await blobToBase64(blob);
          localStorage.setItem(`topicImage-${topicId}`, base64Image);
        })
        .catch((err) => {
          console.error("Error fetching or storing image:", err);
        });
    }
    // console.log(topics1)
  }, [topic.image, topicId]);

  // Retrieve image from local storage if available
  const localImage =
    localStorage.getItem(`topicImage-${topicId}`) || topic.image;

  const [voteStatus, setVoteStatus] = useState("start");
  const handleVote = (candidateId, choiceIndex) => {
    castVote(topicId, candidateId, choiceIndex);
  };

  const exportToCSV = (topic) => {
    // console.log(toic.pin)
    const rows = [
      ["Num", "Vote Key", "Vote Weight"],
      ...topic.pin.map((pinObj, idx) => [idx + 1, pinObj.voteKey, pinObj.voteWeight]),
    ];

    // Create CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function (rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pins.csv");
    document.body.appendChild(link);
    link.click();
  };
  const exportToPDF = (topic) => {
    const rows = [
      ["Num", "Vote Key", "Vote Weight"],
      ...topic.pin.map((pinObj, idx) => [idx + 1, pinObj.voteKey, pinObj.voteWeight]),
    ];
    // Create PDF
    const doc = new jsPDF();
    doc.autoTable({
      head: [rows[0]],
      body: rows.slice(1),
    });
    doc.save("pins.pdf");
  };
  const handleCopyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch((err) => {
        message.error("Failed to copy link!");
        console.error("Could not copy text: ", err);
      });
  };
  const voteHandle = (voteStatus) => {
    setVoteStatus(voteStatus);
  };
  // console.log(topic.choices)
  const columns = [
    {
      title: "Num",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Vote Key",
      dataIndex: "voteKey",
      key: "voteKey",
    },
    {
      title: "Vote Weight",
      dataIndex: "voteWeight",
      key: "voteWeight",
    },
    {
      title: "Used By",
      dataIndex: "votedBy",
      key: "votedBy",
    },
  ];
  const dataSource =
    topic && topic.pin
      ? topic.pin.map((pinObj, pinIndex) => ({
        key: pinIndex,
        number: pinIndex + 1,
        voteKey: pinObj.voteKey,
        voteWeight: pinObj.voteWeight,
        votedBy: pinObj.votedBy
      }))
      : [];
  // console.log(topic.startDate)
  return (
    <div className="flex justify-center flex-col mt-10 bg-[#DEE9EF]">
      <VoteSteps stepNow={1} />
      <div className="w-full pl-10 pr-10">
        <div className="border rounded-md p-8 shadow-lg bg-[#FFFFFF]">
          <div className="flex justify-center items-center">
            {localImage && (
              <Image
                src={localImage}
                alt={topic.name}
                width="400px"
                className="rounded-md h-64 object-cover mb-4"
              />
            )}
          </div>
          {topic.title && (
            <p className="text-gray-600 text-2xl">Title: {topic.title}</p>
          )}
          {topic.description && (
            <p className="text-gray-600 text-2xl pt-10">
              Desc: {topic.description}
            </p>
          )}
          {topic.name && (
            <p className="text-gray-600 text-2xl pt-10">Name: {topic.name}</p>
          )}
          {topic.durationType === "schedule" && (
            <>
              <p className="text-gray-600 text-2xl pt-10">
                Start Date:{" "}
                {new Date(parseInt(topic.startDate)).toLocaleString()}
              </p>
              <p className="text-gray-600 text-2xl pt-10">
                End Date: {new Date(parseInt(topic.endDate)).toLocaleString()}
              </p>
            </>
          )}
          <div className="flex items-center pt-10 w-full md:w-2/3 lg:w-1/2">
            <p className="text-gray-600 text-2xl pr-4">
              Link:
            </p>
            <Input
              value={topic.link}
              disabled={true}
              className="w-full text-black"
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => handleCopyLink(topic.link)}
              type="text"
            />
          </div>


          {topic.invitationType === "email" ? (
            <div className="my-3 overflow-y-auto pt-10">
              <Table dataSource={topic.emailList} pagination={false} rowKey={(record) => record.email}>
                <Table.Column title="Email" dataIndex="email" key="email" />
                <Table.Column title="First Name" dataIndex="firstName" key="firstName" />
                <Table.Column title="Last Name" dataIndex="lastName" key="lastName" />
                <Table.Column title="Vote Weight" dataIndex="voteWeight" key="voteWeight" />
                <Table.Column title="Vote Key" dataIndex="voteKey" key="voteKey" />
                <Table.Column title="Vote Time" dataIndex="voteTime" key="voteTime" />

              </Table></div>
          ) : (
            <>
              {/* Pin */}
              <p className="text-gray-600 text-2xl pt-10">
                Pins:
                <Button
                  type="primary"
                  onClick={() => exportToCSV(topic)}
                  className="ml-10"
                >
                  CSV
                </Button>
                <Button
                  type="primary"
                  onClick={() => exportToPDF(topic)}
                  className="ml-4"
                >
                  PDF
                </Button>
              </p>
              <div className="text-gray-600 text-2xl pt-10 p-20">
                <div
                  className="overflow-y-auto border-2"
                  style={{ maxHeight: "300px" }}
                >
                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    id={`pin-table-${topic.id}`}
                    className="w-full border-collapse"
                  />
                </div>
              </div>
            </>
          )}

          {topic.durationType === "manual" && (
            <div className="flex items-center justify-center ">
              {voteStatus === "start" && (
                <button
                  type="button"
                  onClick={() => setVoteStatus("end")}
                  className="text-[20px] text-[#00B6DE] flex justify-center mr-5"
                >
                  <div className="bg-[#FFFFFF] border-[3px] border-[#38B56A] text-[#38B56A] rounded-[11px] px-[27px] border-solid flex justify-center items-center py-4 w-[150px]">
                    Start Vote
                  </div>
                </button>
              )}
              {voteStatus === "end" && (
                <button
                  type="button"
                  onClick={() => setVoteStatus("start")}
                  className="text-[20px] text-[#00B6DE] flex justify-center mr-5"
                >
                  <div className="bg-[#FFFFFF] border-[3px] border-[#38B56A] text-[#38B56A] rounded-[11px] px-[27px] border-solid flex justify-center items-center py-4 w-[150px]">
                    End Vote
                  </div>
                </button>
              )}
              <button
                type="button"
                onClick={showResults} // updated here
                className="text-[20px] text-[#00B6DE] flex justify-center"
              >
                <div className="bg-[#FFFFFF] border-[3px] border-[#38B56A] text-[#38B56A] rounded-[11px] px-[27px] border-solid flex justify-center items-center py-4 w-[150px]">
                  Result
                </div>
              </button>
            </div>
          )}
          {topic.durationType === "schedule" && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={showResults} // updated here
                className="text-[20px] text-[#00B6DE] flex justify-center"
              >
                <div className="bg-[#FFFFFF] border-[3px] border-[#38B56A] text-[#38B56A] rounded-[11px] px-[27px] border-solid flex justify-center items-center py-4 w-[150px]">
                  Result
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vote;

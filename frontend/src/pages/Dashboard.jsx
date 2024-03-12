import React, { useState, useEffect } from 'react';

async function fetchQuestionData(id) {
  const response = await fetch(`http://localhost:3000/question?qid=${id}`);
  const { question, choise } = await response.json();
  return { question, choise };
}

export default function Dashboard() {
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchQuestionData(1); // Assuming id is 1, you can pass the appropriate id here
      setQuestionData(data);
    };

    fetchData();
  }, []);

  if (!questionData) {
    return <div>Loading...</div>;
  }

  const { question, choise } = questionData;

  return (
    <div>
      <h1>{question}</h1> <br />
      {choise && choise.length > 0 ? (
        choise.map((choise, index) => (
          <button key={index}>{choise}</button>
        ))
      ) : (
        <div>No choices available</div>
      )}
      <br />
      <br />
      {/* Add the next and previous buttons here */}
      <button>Next</button> 
      <button>Previous</button> <br />
    </div>
  );
}

import './App.css'
import React, { useEffect, useState } from 'react';
import { fetchNui } from "../utils/fetchNui";
import { debugData } from "../utils/debugData";

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  }
]);

const App: React.FC = () => {
  const [clientData, setClientData] = useState<string>();
  const getClientData = () => {
    fetchNui<string>('getClientData').then(res => {
      console.log('getClientData ', res);
      setClientData(res);
    }).catch(e => {
      setClientData(`Error: ${e}`);
    })
  }

  useEffect(() => {
    getClientData();
  }, []);

  return (
    <>
      <h1>Hello world!</h1>
      <span>{clientData}</span>
    </>
  );
}

export default App;

// src/App.tsx

import React, { useEffect, useState } from 'react';
import TreeChart from './components/TreeChart';

interface NodeData {
  name: string;
  value: number;
  children?: NodeData[];
}

const App: React.FC = () => {
  const [data, setData] = useState<NodeData | null>(null);

  useEffect(() => {
    fetch('http://localhost:8081/api/nodes/tree')
      .then(response => response.json())
      .then((jsonData: NodeData) => setData(jsonData))
      .catch(error => console.error("Failed to fetch data", error));
  }, []);

  return (
    <div>
      {data ? <TreeChart data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default App;

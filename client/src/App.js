import { useState } from "react";
import axios from "axios";

function App() {
  const [sourceUri, setSourceUri] = useState("");
  const [targetUri, setTargetUri] = useState("");
  const [dbName, setDbName] = useState("");
  const [collectionName, setCollectionName] = useState("");

  const migrate = async () => {
    await axios.post("http://localhost:5000/api/migrate", {
      sourceUri,
      targetUri,
      dbName,
      collectionName
    });

    alert("Migration started");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>MongoDB Migration Tool</h2>

      <input placeholder="Source URI" onChange={e => setSourceUri(e.target.value)} />
      <br /><br />

      <input placeholder="Target URI" onChange={e => setTargetUri(e.target.value)} />
      <br /><br />

      <input placeholder="Database Name" onChange={e => setDbName(e.target.value)} />
      <br /><br />

      <input placeholder="Collection (optional)" onChange={e => setCollectionName(e.target.value)} />
      <br /><br />

      <button onClick={migrate}>Start Migration</button>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { ipcRenderer } from "electron";
//
import LogItem from "./LogItem";
import AddLogItem from "./AddLogItem";

const App = () => {
  const [logs, setLogs] = useState([
    {
      _id: 1,
      text: "this is log one",
      priority: "low",
      user: "Brad",
      created: new Date().toString(),
    },
    {
      _id: 2,
      text: "this is log two",
      priority: "moderate",
      user: "Kate",
      created: new Date().toString(),
    },
    {
      _id: 3,
      text: "this is log three",
      priority: "high",
      user: "John",
      created: new Date().toString(),
    },
  ]);
  const [addLogStatus, setAddLogStatus] = useState("");

  //get database
  useEffect(() => {
    ipcRenderer.send("logs:load");
    //
    ipcRenderer.on("logs:get", (e, logs) => {
      // console.log("[app-get]--", JSON.parse(logs));
      setLogs(JSON.parse(logs));
    });
  }, []);

  //addLogItem
  function addLogItem(newLog) {
    // const new_logs = [...logs];
    // new_logs.unshift(newLog);
    setLogs([newLog, ...logs]);
    //
    setAddLogStatus("success");
    setTimeout(() => {
      setAddLogStatus("");
    }, 400);
  }

  function removeLogItem(logId) {
    const newLogs = logs.filter((log) => log._id !== logId);
    setLogs(newLogs);
  }

  return (
    <Container>
      <AddLogItem addItem={addLogItem} addItemStatus={addLogStatus} />

      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log Text</th>
            <th>User</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, index) => (
            <LogItem
              key={"KEY:" + index}
              log={log}
              removeItem={removeLogItem}
            />
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;

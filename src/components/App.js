import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
//
import { ipcRenderer } from "electron";
//
import LogItem from "./LogItem";
import AddLogItem from "./AddLogItem";

const App = () => {
  const [logs, setLogs] = useState([]);
  const [addLogStatus, setAddLogStatus] = useState("");

  //get database
  useEffect(() => {
    ipcRenderer.send("logs:load");
    //on: get
    ipcRenderer.on("logs:get", (e, logs) => {
      // console.log("[app-get]--", JSON.parse(logs));
      setLogs(JSON.parse(logs));
    });
    //on:add-success
    ipcRenderer.on("logs:success", (e, opt) => {
      setStatus("success");
    });
    //on: removed
    ipcRenderer.on("logs:removed", (e, opt) => {
      setStatus("remove");
    });
    //on: clear-all
    ipcRenderer.on("logs:clearAll", (e, opt) => {
      setLogs([]);
    });
  }, []);

  //addLogItem
  function addLogItem(newLog) {
    // const new_logs = [...logs];
    // new_logs.unshift(newLog);
    // setLogs([newLog, ...logs]);
    ipcRenderer.send("logs:add", newLog);
    //
  }

  //setStatus
  const setStatus = (type) => {
    setAddLogStatus(type);
    setTimeout(() => {
      setAddLogStatus("");
    }, 400);
  };

  //
  function removeLogItem(logId) {
    // const newLogs = logs.filter((log) => log._id !== logId);
    // setLogs(newLogs);
    ipcRenderer.send("logs:delete", logId);
  }

  //

  return (
    <Container>
      <Row className="mt-3">
        <h3>BugLogger</h3>
      </Row>
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

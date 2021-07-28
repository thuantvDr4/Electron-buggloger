import React from "react";
import Moment from "react-moment";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const LogItem = ({ log, removeItem }) => {
  const { priority, user, text, created, _id } = log;

  const setVariant = () => {
    if (priority === "high") {
      return "danger";
    }
    if (priority === "moderate") {
      return "warning";
    }
    if (priority === "low") {
      return "success";
    }
  };

  function removeLog() {
    removeItem && removeItem(_id);
  }

  return (
    <tr>
      <td>
        <Button variant={setVariant()} size="sm">
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Button>
      </td>
      <td>{text}</td>
      <td>{user}</td>
      <td>
        <Moment format="MMMM Do YYYY, h:mm:ss a">{new Date(created)}</Moment>
      </td>
      <td>
        <Button variant="danger" size="sm" onClick={removeLog}>
          X
        </Button>
      </td>
    </tr>
  );
};
export default LogItem;

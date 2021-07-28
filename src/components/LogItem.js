import React from "react";
import Moment from "react-moment";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

const LogItem = ({ log }) => {
  const { priority, user, text, created } = log;

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
        <Button variant="danger" size="sm">
          X
        </Button>
      </td>
    </tr>
  );
};
export default LogItem;

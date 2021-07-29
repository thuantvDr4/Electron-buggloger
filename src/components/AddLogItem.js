import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { v4 as uuidv4 } from "uuid";

const AddLogItem = ({ addItem, addItemStatus = "0" }) => {
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [priority, setPriority] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "Success!",
    variant: "success",
  });
  //
  useEffect(() => {
    if (addItemStatus === "success") {
      showAlert("Add log is success!", "success");
      return;
    }
    if (addItemStatus === "remove") {
      showAlert("Log is removed", "warning");
      return;
    }
  }, [addItemStatus]);

  //
  function handleSubmit(e) {
    e.preventDefault();

    if (text === "" || user === "" || priority === "") {
      showAlert("Log, User and Priority is require!", "danger");
      return;
    }
    if (text.trim() === "" || user.trim() === "" || priority === "0") {
      showAlert("Log, User and Priority is require!", "danger");
      clearForm();
      return;
    }

    //
    addItem &&
      addItem({
        // _id: uuidv4(),
        text: text,
        priority: priority,
        user: user,
        created: new Date().toString(),
      });
    //
    clearForm();
  }

  //clearForm
  const clearForm = () => {
    setPriority("");
    setText("");
    setUser("");
  };

  //show alert
  const showAlert = (mess = "info", type = "success") => {
    setAlert({
      show: true,
      message: mess,
      variant: type,
    });
    setTimeout(() => {
      setAlert({
        show: false,
        message: "",
        variant: "success",
      });
    }, 2000);
  };

  return (
    <Card className="mt-3 md3">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="my-3">
            <Col>
              <Form.Control
                type="log"
                placeholder="Log"
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                type="user"
                placeholder="User"
                onChange={(e) => setUser(e.target.value)}
                value={user}
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                type="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="0">Select Priority</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </Form.Control>
            </Col>
          </Row>

          <Row className="my-3 mx-1">
            <Button type="submit" variant="secondary" block>
              Add log
            </Button>
          </Row>
        </Form>

        {alert.show && (
          <Row className="mt-3 mx-1">
            <Alert variant={alert.variant}>{alert.message}</Alert>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default AddLogItem;

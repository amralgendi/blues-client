import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, InputOnChangeData, Message } from "semantic-ui-react";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState({
    success: false,
    message: "",
  });

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(localStorage.getItem("token"));

    axios
      .post(`http://localhost:5000/api/users/forgot-password`, { email })
      .then(({ data: { success, message } }) => {
        console.log(success, message);

        setSuccess({ success, message });
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          console.log(errors);
          setErrors(Object.values(errors as object)[0]);
        }
      );
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { name, value }: InputOnChangeData
  ) => {
    setEmail(value);
    setErrors("");
  };
  return (
    <div className="Form">
      <h1>Verify User</h1>
      <Form onSubmit={handleVerify} noValidate success={success.success}>
        <Form.Input
          error={
            errors !== "" && {
              content: errors,
              pointing: "above",
            }
          }
          name="email"
          label="Email"
          type="text"
          placeholder="Enter Email"
          onChange={onChange}
          value={email}
        />
        <Message attached="bottom" success>
          {success.message}. <Link to="/">Head to Home Page</Link>
        </Message>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Forgot;

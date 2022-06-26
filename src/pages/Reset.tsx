import axios from "axios";
import React, { useState } from "react";
import { Button, Form, InputOnChangeData, Message } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
// interface IRegisterInputs {
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

const Reset = () => {
  const { id, token } = useParams();
  console.log(id, token);

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState({
    success: false,
    message: "",
  });

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:5000/api/users/reset-password/${id}/${token}`,
        values
      )
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
          setErrors((oldErrors) => ({ ...oldErrors, ...errors }));
        }
      );
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { name, value }: InputOnChangeData
  ) => {
    setValues((oldValues) => ({ ...oldValues, [name]: value }));
    setErrors((oldErrors) => ({ ...oldErrors, [name]: "" }));
  };
  return (
    <div className="Form">
      <h1>Register</h1>
      <Form onSubmit={handleRegister} noValidate success={success.success}>
        <Form.Input
          error={
            errors.password !== "" && {
              content: errors.password,
              pointing: "above",
            }
          }
          name="password"
          label="Password"
          type="password"
          placeholder="8+ characters"
          onChange={onChange}
          value={values.password}
        />
        <Form.Input
          error={
            errors.confirmPassword !== "" && {
              content: errors.confirmPassword,
              pointing: "above",
            }
          }
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          onChange={onChange}
          value={values.confirmPassword}
        />
        <Message attached="bottom" success>
          {success.message}. <Link to="/signin">Sign in</Link>
        </Message>
        <Button type="submit">Reset</Button>
      </Form>
    </div>
  );
};

export default Reset;

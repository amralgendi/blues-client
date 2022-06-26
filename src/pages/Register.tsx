import axios from "axios";
import React, { useState } from "react";
import { Button, Form, InputOnChangeData } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import { useNavigate } from "react-router-dom";
// interface IRegisterInputs {
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  console.log(values);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        "https://floating-bayou-81904.herokuapp.com/api/users/register",
        values
      )
      .then(({ data: { data } }) => {
        // setLoading(false);

        localStorage.setItem("token", data.token);
        dispatch(authActions.signin(data));
        navigate("/verify");
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          // setLoading(false);

          console.log(errors);
          setErrors((oldErrors) => ({ ...oldErrors, ...errors }));
        }
      )
      .finally(() => {
        setLoading(false);
      });
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
      <Form onSubmit={handleRegister} noValidate loading={loading}>
        <Form.Input
          error={
            errors.email !== "" && {
              content: errors.email,
              pointing: "above",
            }
          }
          name="email"
          label="Email"
          type="text"
          placeholder="Email"
          onChange={onChange}
          value={values.email}
        />
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
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Register;

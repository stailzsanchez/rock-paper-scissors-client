import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import useLoginUser from "./useLoginUser";

const REGISTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput) {
    registerUser(input: $registerInput) {
      id
      email
      name
      token
    }
  }
`;

const initLoginData = { email: "", password: "" };

const useRegisterUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [errors, setErrors] = useState([]);
  const { loginUser } = useLoginUser();
  const [loginData, setLoginData] = useState(initLoginData);

  const [_registerUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted(proxy, { data }) {
      setData(data);
      //register and login quickly
      loginUser(loginData.email, loginData.password);
      setLoginData(initLoginData);
      navigate("/");
    },
    onError({ graphQLErrors }) {
      setErrors(graphQLErrors);
    }
  });

  const registerUser = (name, email, password) => {
    _registerUser({ variables: { registerInput: { name, email, password } } });
    setLoginData({ email, password });
  };

  return {
    registerReturnData: data?.registerUser,
    registerUser,
    loading,
    errors: errors
  };
};

export default useRegisterUser;

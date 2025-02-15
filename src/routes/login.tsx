import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Wrapper,
  Form,
  Input,
  Title,
  Error,
  Switcher,
} from "../style/commonStyle";
import GithubBtn from "../components/github-btn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import ResetPassword from "../components/reset-password";
import GoogleBtn from "../components/google-btn";
import "../style/global.css";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 화면새로고침 방지
    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000, // 3초 후 자동 닫힘
        // hideProgressBar: false,
        // closeOnClick: true,
        // pauseOnHover: true,
        // draggable: true,
        // progress: undefined,
      });

      navigate("/");
      // create an account
      // set the user profile
      // redirect to home
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast.error(e.message, { position: "top-right" });
        setEmail("");
        setPassword("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Login to WAGGLE!</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Login"}
          style={{ backgroundColor: "#1c92e0", fontWeight: "bold" }}
        />
      </Form>
      {error !== "" ? (
        <Error style={{ textAlign: "center" }}>{error}</Error>
      ) : null}
      <Switcher>
        Don't have an account?
        <Link to="/create-account">
          Create one
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            arrow_forward_ios
          </span>
        </Link>
        <br />
        <p style={{ marginTop: "10px" }}>
          Forgot password? <ResetPassword email={email} />
        </p>
      </Switcher>
      <GithubBtn />
      <GoogleBtn />
      {/* ToastContainer는 react-toastify에서 토스트 메시지를 화면에 표시하는 역할 */}
      <ToastContainer />
    </Wrapper>
  );
}

import { useState } from "react"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Wrapper, Form, Input, Title, Error, Switcher } from "../style/commonStyle"
import GithubBtn from "../components/github-btn"

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    if (name === 'email') setEmail(value)  
    else if (name === 'password') setPassword(value)
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // 화면새로고침 방지
    setError('')
    if (isLoading || email === '' || password === '') return
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
      // create an account
      // set the user profile
      // redirect to home
    } catch(e) {
      if(e instanceof FirebaseError) {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }
  return <Wrapper>
    <Title>Login to WAGGLE!</Title>
    <Form onSubmit={onSubmit}>
      <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
      <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
      <Input type="submit" value={isLoading ? "Loading..." : "Login"} style={{backgroundColor: "#ffc907", fontWeight: 'bold'}} />
    </Form>
    {error !== '' ? <Error style={{textAlign: 'center'}}>{error}</Error> : null}
    <Switcher>
      Don't have an account? <Link to="/create-account">Create one 
      <span className="material-icons" style={{lineHeight: '10px', position: 'relative', top: '7px'}}>arrow_forward_ios</span></Link> 
    </Switcher>
    <GithubBtn />
  </Wrapper>
}
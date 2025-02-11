import { useState } from "react"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { Wrapper, Form, Input, Title, Error, Switcher } from "../style/commonStyle"
import GithubBtn from "../components/github-btn"

// const errors = {
//   'auth/email-already-in-use': 'That email already exists.',
//   'auth/weak-password': 'Password should be at least 6 characters.',
// }

export default function CreateAccount() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    if(name === 'name') setName(value)
    else if (name === 'email') setEmail(value)  
    else if (name === 'password') setPassword(value)
  }
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // 화면새로고침 방지
    setError('')
    if (isLoading || name === '' || email === '' || password === '') return
    try {
      setLoading(true)
      const credentials = await createUserWithEmailAndPassword(auth, email, password)
      // console.log(credentials.user)
      await updateProfile(credentials.user, {
        displayName: name
      })
      navigate("/")
      // create an account
      // set the user profile
      // redirect to home
    } catch(e) {
      if(e instanceof FirebaseError) {
        // console.log(e.code, e.message) // auth/email-already-in-use | Firebase: Error (auth/email-already-in-use)
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }
  return <Wrapper>
    <Title>Join WAGGLE!</Title>
    <Form onSubmit={onSubmit}>
      <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required /> 
      <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required />
      <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required />
      <Input type="submit" value={isLoading ? "Loading..." : "Create Account"} style={{backgroundColor: "#ffc907", fontWeight: 'bold'}} />
    </Form>
    {error !== '' ? <Error style={{textAlign: 'center'}}>{error}</Error> : null}
    <Switcher>
      Already have an account? <Link to="/login">Please login 
      <span className="material-icons" style={{lineHeight: '10px', position: 'relative', top: '7px'}}>arrow_forward_ios</span></Link> 
    </Switcher>
    <GithubBtn />
  </Wrapper>
}
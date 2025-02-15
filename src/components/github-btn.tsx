import { GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { Button, Logo } from "../style/commonStyle"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

export default function GithubBtn() {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider()
      await signInWithPopup(auth, provider)
      navigate("/")
      
    } catch(e) {
      console.error(e)
    }
  }

  return <Button onClick={onClick}>
    <Logo src="/github-mark.svg" />
    Continue with Github
  </Button>
}
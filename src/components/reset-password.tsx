import { useState } from 'react'
import { auth } from "../firebase"
import { sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'

interface ResetPasswordProps {
  email: string
}

export default function ResetPassword({ email }: ResetPasswordProps) {

  const [isLoading, setLoading] = useState(false)

  const onResetPassword = async () => {
    if (!email) {
      toast.warn("Please enter your email signed up first.")
      return
    }
    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, email)
      toast.success("Password reset link sent to your email. Check it now!")
    } catch (e) {
      console.log(e)
      toast.error("Failed to send password reset email. Check and enter the email again.")
    } finally {
      setLoading(false)
    }
  }
  
  return (
  <button onClick={onResetPassword} style={{ background: "none", border: "none", color: "#1c92e0", cursor: "pointer", textDecoration: "underline", fontSize: '16px' }}
  disabled={isLoading}>
    { isLoading ? 'Sending...' : 'Reset' } <span className="material-icons" style={{lineHeight: '10px', position: 'relative', top: '7px'}}>arrow_forward_ios</span>
  </button>
  )
}
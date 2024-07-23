import GoogleIcon from '@mui/icons-material/Google'
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography
} from '@mui/material'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      if (res.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password
        })

        if (result.error) {
          setError('登録は成功しましたが、ログインに失敗しました。ログインページに移動します。')
          setTimeout(async () => await router.push('/login'), 3000)
        } else {
          router.push('/')
        }
      } else {
        const data = await res.json()
        throw new Error(data.message || 'Registration failed')
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          新規登録
        </Typography>
        {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="名前"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value) }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            登録
          </Button>
        </Box>
        <Divider sx={{ width: '100%', my: 2 }}>または</Divider>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
          sx={{ mt: 1, mb: 2 }}
        >
          Googleアカウントで登録
        </Button>
      </Box>
    </Container>
  )
}

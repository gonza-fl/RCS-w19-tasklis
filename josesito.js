import 'dotenv/config'
import * as jose from 'jose'

const argument = process.argv[2]
const token = process.argv[3]

const secret = new TextEncoder().encode(
  process.env.SECRET_KEY,
)



if (argument === '--verify') {
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(token, secret)
    console.log(payload, protectedHeader)
  } catch (error) {
    console.log({
      message: error.message,
      code: error.code,
      claim: error.claim,
      reason: error.reason,
    })
  }

}
else {
  const data = { username: 'josesito', role: 'admin' }

  const jwt = await new jose.SignJWT(data)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1m')
    .sign(secret)

  console.log(jwt)
}



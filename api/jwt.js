import * as jose from 'jose';

export const signJWT = async (username, sub) => {
  const secret = new TextEncoder().encode(
    process.env.JWT_TOKEN,
  )
  const alg = 'HS256'

  const jwt = await new jose.SignJWT({ username })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setSubject(sub)
    .setIssuer('urn:platzi:issuer')
    .setAudience('urn:platzi:audience')
    .setExpirationTime('2h')
    .sign(secret)

  return jwt
}

export const verifyJWT = async (token) => {
  const secret = new TextEncoder().encode(
    process.env.JWT_TOKEN,
  )
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: 'urn:platzi:issuer',
      audience: 'urn:platzi:audience',
    })

    console.log(payload)
    return payload
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

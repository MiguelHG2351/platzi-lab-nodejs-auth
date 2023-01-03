import * as jose from 'jose';

export async function signJWT(username, sub) {
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

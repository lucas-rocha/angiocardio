export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (email === 'angiocardiolitoral@gmail.com' && password === '123') {
    return new Response(
      JSON.stringify({ email, role: 'ADMIN' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (email === 'user@angiocardiolitoral' && password === '123') {
    return new Response(
      JSON.stringify({ email, role: 'USER' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
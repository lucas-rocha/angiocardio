export async function GET(request: Request) {
  return Response.json({ name: 'oko' })
}

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (email === 'angiocardiolitoral@gmail.com' && password === '123') {
    return new Response(
      JSON.stringify({ email, password }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
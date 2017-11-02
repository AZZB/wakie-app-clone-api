

export function send_request(request, method, path, body, token) {
  method = method.toLowerCase()
  if( method === 'get') request = request.get(path)
  if( method === 'post') request = request.post(path).type('form').send(body)
  if( method === 'put') request = request.put(path).type('form').send(body)
  if( method === 'del') request = request.del(path)

  if(method === 'get' || method === 'del') token = body

  const headers = { 'Accept': 'application/json' }

  if(token) headers['Authorization'] = `Bearer ${token}`

  request = request.set(headers)

  return request
}


export async function login_process(request, credential) {
  try {
    credential = credential || {email: 'base_user@email.com', password: 'base_user_password'}
    const {email, password} = credential

    const { body }  = await send_request(request, 'post', '/auth/login', {
                        login: email,
                        password: password,
                      })
                      .expect('Content-Type', /json/)
                      .expect(200)

    return body['data']
  } catch (e) {
    console.log(e);
  }
}

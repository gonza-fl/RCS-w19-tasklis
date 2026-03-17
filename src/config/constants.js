export const EMAIL_TEMP = {
  FROM: '"Test Sender" <test@example.com>',
  SUBJECT: 'Confirma tu email',
  TEXT: (email) => `Confirma tu email para activar tu cuenta ${email}`,
  HTML: (token) => `
    <h1>Confirma tu email</h1>
    <p>Confirma tu email para activar tu cuenta</p>
    <a href="http://localhost:5173/confirm-email?token=${token}">Confirmar email</a>
  `
}
import bcrypt from 'bcrypt'
export default async function (data: string | Buffer, salt: number = 10) {
  const genSalt = await bcrypt.genSalt(salt)
  return bcrypt.hash(data, genSalt)
}

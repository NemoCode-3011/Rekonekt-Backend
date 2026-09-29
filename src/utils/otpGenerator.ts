 import crypto from "crypto"

 export const otpGenerator = (length = 6): string =>{
  return crypto.randomInt(0, 10 ** length).toString().padStart(length, "0")
 }

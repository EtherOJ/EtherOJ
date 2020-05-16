const base64abc =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export default {

  encode (bytes) {
    bytes = new TextEncoder().encode(bytes)
    let result = ''
    let i
    const l = bytes.length

    for (i = 2; i < l; i += 3) {
      result += base64abc[bytes[i - 2] >> 2]
      result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
      result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)]
      result += base64abc[bytes[i] & 0x3F]
    }
    if (i === l + 1) { // 1 octet missing
      result += base64abc[bytes[i - 2] >> 2]
      result += base64abc[(bytes[i - 2] & 0x03) << 4]
      result += '=='
    }
    if (i === l) { // 2 octets missing
      result += base64abc[bytes[i - 2] >> 2]
      result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
      result += base64abc[(bytes[i - 1] & 0x0F) << 2]
      result += '='
    }
    return result
  },

  decode (bytes) {
    return new TextDecoder('utf-8').decode(Buffer.from(bytes, 'base64'))
  }
}

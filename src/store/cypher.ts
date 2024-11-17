

export async function generateKey() {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256, // Taille de la clé : 256 bits
    },
    true, // Exportable ou non
    ['encrypt', 'decrypt'] // Usages autorisés
  );
}


export async function encryptData(key: CryptoKey, data: string) {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12)); // IV de 12 octets pour AES-GCM

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoder.encode(data) // Les données doivent être encodées en UTF-8
  );

  return { encrypted: new Uint8Array(encrypted), iv };
}


export async function decryptData(
  key: CryptoKey,
  encryptedData: ArrayBuffer,
  iv: ArrayBuffer
) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted); // Retourne le texte déchiffré
}

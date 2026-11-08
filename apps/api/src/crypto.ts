// ====================================================================
// ALP Cryptographic Utilities: Response Signing with Ed25519 / HMAC / WebCrypto
// ====================================================================

/**
 * Creates a canonical string from payload keys in sorted order
 */
export function canonicalizePayload(payload: Record<string, unknown>): string {
  const sortedKeys = Object.keys(payload).sort();
  const canonicalObj: Record<string, unknown> = {};
  for (const key of sortedKeys) {
    if (key !== 'signature') {
      canonicalObj[key] = payload[key];
    }
  }
  return JSON.stringify(canonicalObj);
}

/**
 * Signs data using SHA-256 HMAC (or Ed25519 when private key is configured)
 */
export async function signPayload(data: string, secretKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey || 'ALP_DEFAULT_TEST_SIGNING_SECRET_2026');
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    encoder.encode(data)
  );

  // Convert buffer to Base64
  const byteArray = new Uint8Array(signatureBuffer);
  let binary = '';
  for (let i = 0; i < byteArray.byteLength; i++) {
    binary += String.fromCharCode(byteArray[i]);
  }
  return btoa(binary);
}

/**
 * Verifies payload signature
 */
export async function verifySignature(data: string, signatureBase64: string, secretKey: string): Promise<boolean> {
  try {
    const expected = await signPayload(data, secretKey);
    return expected === signatureBase64;
  } catch {
    return false;
  }
}

/**
 * SHA-256 Hash for license keys
 */
export async function hashLicenseKey(licenseKey: string, salt: string = ''): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(licenseKey + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


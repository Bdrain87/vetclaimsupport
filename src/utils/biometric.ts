/**
 * WebAuthn Biometric Authentication Utility
 * Provides biometric-based authentication for securing sensitive operations
 */

/**
 * Check if the device supports WebAuthn biometric authentication
 */
export function isBiometricSupported(): boolean {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
}

/**
 * Initiate a biometric handshake using WebAuthn
 * Returns true if the user successfully authenticates via biometric
 */
export async function initiateBiometricHandshake(): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    console.error('Biometric hardware not supported.');
    return false;
  }

  try {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const options: CredentialCreationOptions = {
      publicKey: {
        challenge,
        rp: { name: 'Vet Claim Support' },
        user: {
          id: new Uint8Array(16),
          name: 'user',
          displayName: 'Veteran',
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        timeout: 60000,
        authenticatorSelection: {
          userVerification: 'required',
        },
      },
    };

    const credential = await navigator.credentials.create(options);
    return !!credential;
  } catch (err) {
    console.error('Authentication Error:', err);
    return false;
  }
}

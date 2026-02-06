const initiateBiometricHandshake = async () => {
  if (!window.PublicKeyCredential) return false;

  try {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const options: CredentialRequestOptions = {
      publicKey: {
        challenge,
        rp: { name: "Vet Claim Support" },
        user: {
          id: new Uint8Array(16),
          name: "user",
          displayName: "Veteran"
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        timeout: 60000,
        userVerification: "required"
      }
    };
    const credential = await navigator.credentials.create(options);
    return !!credential;
  } catch (err) {
    console.error("Biometric Failed", err);
    return false;
  }
};

export default initiateBiometricHandshake;

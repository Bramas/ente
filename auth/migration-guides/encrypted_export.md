# Auth Encrypted Export format

## Overview

When we export the auth codes, the data is encrypted using a key derived from the user's password.
This document describes the JSON structure used to organize exported data, including versioning and key derivation
parameters.

## Export JSON Sample

```json
{
  "version": 1,
  "kdfParams": {
    "memLimit": 4096,
    "opsLimit": 3,
    "salt": "example_salt"
  },
  "encryptedData": "encrypted_data_here",
  "encryptionNonce": "nonce_here"
}
```

The main object used to represent the export data. It contains the following key-value pairs:

- `version`: The version of the export format.
- `kdfParams`:  Key derivation function parameters.
- `encryptedData"`:  The encrypted authentication data.
- `encryptionNonce`: The nonce used for encryption.

### Version

Export version is used to identify the format of the export data.

#### Ver: 1

* KDF Algorithm: `ARGON2ID`
* Decrypted data format: `otpauth://totp/...`, separated by a new line.
* Encryption Algo: `XChaCha20-Poly1305`

#### Key Derivation Function  Params (KDF)

This section contains the parameters that were using during KDF operation:

- `memLimit`: Memory limit for the algorithm.
- `opsLimit`: Operations limit for the algorithm.
- `salt`:  The salt used in the derivation process.

#### Encrypted Data

As mentioned above, the auth data is encrypted using a key that's derived by using user provided password & kdf params.
For encryption, we are using `XChaCha20-Poly1305` algorithm.

## How to use the exported data

* **Ente Authenticator app**: You can directly import the codes in the Ente Authenticator app.
  > Settings -> Data -> Import Codes -> ente Encrypted export.

* **Decrypt using Ente CLI** : Download the latest version of [Ente CLI](https://github.com/ente-io/ente/releases?q=CLI&expanded=false), and run the following command
         
```
  ./ente auth decrypt <export_file> <output_file>
```

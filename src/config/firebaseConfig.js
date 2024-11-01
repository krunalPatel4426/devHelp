import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// const serviceAccount = JSON.parse(
//     fs.readFileSync("E:/Web Project/Dev Help/confidential/dev-help-b75c9-firebase-adminsdk-vme1j-f9f3de7b2b.json", "utf8")
//   );

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email:process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url:process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://dev-help-b75c9.appspot.com",
});

const bucket = admin.storage().bucket();

export default bucket;

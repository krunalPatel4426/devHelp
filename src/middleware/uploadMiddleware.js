import multer from "multer";
import bucket from "../config/firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
}).any();

async function uploadImagesMiddleware(req, res, next) {
  const { folder } = req.params;
  const imgUrls = [];

  try {
    const img = req.body.img; // Assuming this is a base64 string

    // Upload the primary `img`
    const uploadPrimaryImg = new Promise((resolve, reject) => {
      if (img) {
        const base64Data = img.split(",")[1];
        const fileType = img.split(";")[0].split("/")[1];
        const uniqueFileName = `${uuidv4()}.${fileType}`;
        const blob = bucket.file(`${folder}/${uniqueFileName}`);

        const blobStream = blob.createWriteStream({
          metadata: { contentType: `image/${fileType}` },
        });

        blobStream.on("error", (err) => {
          console.error("Upload error:", err);
          reject(err);
        });

        blobStream.on("finish", () => {
          const url = `${encodeURIComponent(`${folder}/${uniqueFileName}`)}?alt=media`;
          req.body.img = url;
          imgUrls.push(url);
          resolve();
        });

        blobStream.end(Buffer.from(base64Data, "base64"));
      } else {
        resolve(); // If no `img` is provided, resolve immediately
      }
    });

    // Upload `videoLink` images if present
    // const uploadVideoLinkImgs = req.body.videoLink
    //   ? req.body.videoLink.map((each) => {
    //       const img = each.img;
    //       const base64Data = img.split(",")[1];
    //       const fileType = img.split(";")[0].split("/")[1];
    //       const uniqueFileName = `${uuidv4()}.${fileType}`;
    //       const playlistFolder = "playlist";
    //       const blob = bucket.file(`${playlistFolder}/${uniqueFileName}`);

    //       return new Promise((resolve, reject) => {
    //         const blobStream = blob.createWriteStream({
    //           metadata: { contentType: `image/${fileType}` },
    //         });

    //         blobStream.on("error", (err) => {
    //           console.error("Upload error:", err);
    //           reject(err);
    //         });

    //         blobStream.on("finish", () => {
    //           const url = `${encodeURIComponent(`${playlistFolder}/${uniqueFileName}`)}?alt=media`;
    //           each.img = url;
    //           imgUrls.push(url);
    //           resolve();
    //         });

    //         blobStream.end(Buffer.from(base64Data, "base64"));
    //       });
    //     })
    //   : [];

    // Wait for both `img` and `videoLink` uploads to complete
    // await Promise.all([uploadPrimaryImg, ...uploadVideoLinkImgs]);
    await Promise.all([uploadPrimaryImg]);
    next();

  } catch (error) {
    console.error("General error:", error);
    res.status(500).json({ error: "Error processing image upload" });
  }
}

export { upload, uploadImagesMiddleware };

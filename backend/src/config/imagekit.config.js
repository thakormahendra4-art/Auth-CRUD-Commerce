import ImageKit from "imagekit";
import config from "./config.js";

const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY || "placeholder_public_key",
  privateKey: config.IMAGEKIT_PRIVATE_KEY || "placeholder_private_key",
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/placeholder",
});

export default imagekit;

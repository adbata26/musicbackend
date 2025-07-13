import express from "express";
import {
  uploadSong,
  listAllSongs,
  listArtistSongs,
  playSong,
  getSongById,
} from "../controllers/songController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import multer from "multer";
import path from "path";

// Configure Multer for MP3 uploads
// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === "audio" && ext === ".mp3") {
    cb(null, true);
  } else if (file.fieldname === "thumbnail") {
    cb(null, true); // accept any image
  } else {
    cb(new Error("Only MP3 and valid thumbnails are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

const router = express.Router();

// 🎵 Public route: Get all songs for listeners
router.get("/", listAllSongs);

// 🎤 Protected route: Upload song (artist only)
router.post(
  "/upload",
  verifyToken,
  requireRole("artist"),
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadSong
);

// 🎧 Protected route: Artist gets their own uploaded songs
router.get(
  "/artist-songs",
  verifyToken,
  requireRole("artist"),
  listArtistSongs
);

router.get("/:id", getSongById);

// 🔁 Protected route: Increment play count for a song
router.patch("/:id/play", playSong);

export default router;

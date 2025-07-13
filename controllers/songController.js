import path from "path";
import fs from "fs";
import {
  createSong,
  getAllSongs,
  getSongsByArtistId,
  incrementPlayCount,
  getSongByIdFromDB,
} from "../models/SongModel.js";

// Handle MP3 upload
export const uploadSong = (req, res) => {
  const { title } = req.body;
  const artist_id = req.user.id;

  const audioFile = req.files?.audio?.[0];
  const thumbnailFile = req.files?.thumbnail?.[0];

  // Validate MP3 file
  if (
    !audioFile ||
    path.extname(audioFile.originalname).toLowerCase() !== ".mp3"
  ) {
    return res.status(400).json({ message: "Only MP3 files are allowed" });
  }

  const audio_url = `/uploads/${audioFile.filename}`;
  const thumbnail = thumbnailFile ? `/uploads/${thumbnailFile.filename}` : null;

  createSong(title, artist_id, audio_url, thumbnail, (err, result) => {
    if (err) return res.status(500).json({ message: "Upload failed" });
    res.status(201).json({ message: "Song uploaded", songId: result.insertId });
  });
};
// Get all songs (for listeners)
export const listAllSongs = (req, res) => {
  getAllSongs((err, songs) => {
    if (err) return res.status(500).json({ message: "Failed to fetch songs" });
    res.status(200).json({ songs });
  });
};

// Get songs by artist (for artist dashboard)
export const listArtistSongs = (req, res) => {
  const artist_id = req.user.id;
  getSongsByArtistId(artist_id, (err, songs) => {
    if (err)
      return res.status(500).json({ message: "Failed to fetch artist songs" });
    res.status(200).json({ songs });
  });
};

// Increment play count
export const playSong = (req, res) => {
  const songId = req.params.id;
  incrementPlayCount(songId, (err) => {
    if (err) return res.status(500).json({ message: "Failed to record play" });
    res.status(200).json({ message: "Play recorded" });
  });
};

//Get song per id details
export const getSongById = (req, res) => {
  const songId = req.params.id;

  getSongByIdFromDB(songId, (err, song) => {
    if (err) return res.status(500).json({ message: "Failed to fetch song" });
    if (!song) return res.status(404).json({ message: "Song not found" });

    res.status(200).json({ song });
  });
};

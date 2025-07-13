import db from "./db.js";

// Create a new song entry
export const createSong = (
    title,
    artist_id,
    audio_url,
    thumbnail,
    callback
  ) => {
    const sql = `INSERT INTO songs (title, artist_id, audio_url, thumbnail) VALUES (?, ?, ?, ?)`;
    db.query(sql, [title, artist_id, audio_url, thumbnail],callback);
  };


  // Get all songs (used for listeners/homepage)
export const getAllSongs = (callback) => {
    const sql = `
      SELECT songs.id, songs.title, songs.audio_url, songs.play_count, users.name AS artist_name, songs.thumbnail
      FROM songs
      JOIN users ON songs.artist_id = users.id
      ORDER BY songs.id DESC
    `;
    db.query(sql, callback);
  };

  // Get all songs uploaded by a specific artist
export const getSongsByArtistId = (artist_id, callback) => {
    const sql = `SELECT * FROM songs WHERE artist_id = ? ORDER BY id DESC`;
    db.query(sql, [artist_id], callback);
  };

  
// Increment play count of a song
export const incrementPlayCount = (songId, callback) => {
    const sql = `UPDATE songs SET play_count = play_count + 1 WHERE id = ?`;
    db.query(sql, [songId], callback);
  };


  
export const getSongByIdFromDB = (id, callback) => {
  const sql = `SELECT * FROM songs WHERE id = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};
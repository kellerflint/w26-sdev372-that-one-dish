import express from "express";
import { pool } from "../db.js"; // use the centralized pool
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// GET all dishes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM dishes");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// GET a single dish by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM dishes WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Dish not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database query failed" });
  }
});

// POST a new dish
router.post("/", upload.single("image"), async (req, res) => {
  const { dish_name, cuisine, dish_details, restaurant_name, restaurant_address, origin } =
    req.body;

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO dishes
    (dish_name, cuisine, dish_details, restaurant_name, restaurant_address, image_url, origin)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    await pool.query(sql, [
      dish_name,
      cuisine,
      dish_details,
      restaurant_name,
      restaurant_address,
      image_url,
      origin || 'restaurant',
    ]);

    res.status(201).json({ message: "Dish added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add dish" });
  }
});

// PUT to update a dish (with optional image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { dish_name, cuisine, dish_details, restaurant_name, restaurant_address, origin } = req.body;

  try {
    // If a new image is provided, use it; otherwise keep the existing one
    let image_url = undefined;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
      // Get the old image URL to delete the old file
      const [oldDish] = await pool.query("SELECT image_url FROM dishes WHERE id = ?", [id]);
      if (oldDish.length > 0 && oldDish[0].image_url) {
        const oldFilePath = path.join(process.cwd(), oldDish[0].image_url);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    let sql;
    let params;

    if (image_url !== undefined) {
      sql = `
        UPDATE dishes
        SET dish_name=?, cuisine=?, dish_details=?, restaurant_name=?, restaurant_address=?, image_url=?, origin=?
        WHERE id=?
      `;
      params = [dish_name, cuisine, dish_details, restaurant_name, restaurant_address, image_url, origin || 'restaurant', id];
    } else {
      sql = `
        UPDATE dishes
        SET dish_name=?, cuisine=?, dish_details=?, restaurant_name=?, restaurant_address=?, origin=?
        WHERE id=?
      `;
      params = [dish_name, cuisine, dish_details, restaurant_name, restaurant_address, origin || 'restaurant', id];
    }

    const [result] = await pool.query(sql, params);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Dish not found" });

    const [updated] = await pool.query("SELECT * FROM dishes WHERE id = ?", [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update dish" });
  }
});

// DELETE a dish
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM dishes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Dish not found" });

    res.json({ message: "Dish deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete dish" });
  }
});


export default router;
const express = require("express");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();


router.get("/products", (req, res) => {
  const { search, category } = req.query;

  let sql = "SELECT * FROM products WHERE 1=1";

  if (search) {
    sql += ` AND name LIKE '%${search}%'`;
  }

  if (category) {
    sql += ` AND category='${category}'`;
  }

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching products");
    }

    const updated = result.map(p => {
      let images = [];

      try {
        images = p.images ? JSON.parse(p.images) : [];
      } catch {
        images = [];
      }

      return {
        ...p,
        images,
        image: images.length > 0 ? images[0] : p.image 
      };
    });

    res.json(updated);
  });
});



router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("All fields required");
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed],
      (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Signup failed");
        }
        res.send("User created");
      }
    );
  } catch (err) {
    res.status(500).send("Error during signup");
  }
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Server error");
      }

      if (!result || result.length === 0) {
        return res.status(400).send("User not found");
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).send("Wrong password");
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

      res.json({ token, userId: user.id });
    }
  );
});


router.post("/cart/add", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).send("Missing fields");
  }

  db.query(
    "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
    [user_id, product_id, quantity],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error adding to cart");
      }
      res.send("Added to cart");
    }
  );
});



router.post("/wishlist", (req, res) => {
  const { user_id, product_id } = req.body;


  db.query(
    "SELECT * FROM wishlist WHERE user_id=? AND product_id=?",
    [user_id, product_id],
    (err, result) => {
      if (result.length > 0) {
        return res.send("Already in wishlist");
      }

      db.query(
        "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)",
        [user_id, product_id],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error adding to wishlist");
          }
          res.send("Added to wishlist");
        }
      );
    }
  );
});

router.get("/wishlist/:userId", (req, res) => {
  db.query(
    `SELECT wishlist.id, products.id AS product_id, products.name, products.price, products.images, products.image
     FROM wishlist
     JOIN products ON wishlist.product_id = products.id
     WHERE wishlist.user_id=?`,
    [req.params.userId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error fetching wishlist");
      }

      const updated = result.map(p => {
        let images = [];

        try {
          images = p.images ? JSON.parse(p.images) : [];
        } catch {
          images = [];
        }

        return {
          ...p,
          image: images.length > 0 ? images[0] : p.image
        };
      });

      res.json(updated);
    }
  );
});

router.delete("/wishlist/:id", (req, res) => {
  db.query(
    "DELETE FROM wishlist WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error removing item");
      }
      res.send("Removed from wishlist");
    }
  );
});



router.post("/order", (req, res) => {
  const { user_id, total, address, email } = req.body;

  if (!user_id || !total || !address) {
    return res.status(400).send("Missing order details");
  }

db.query("DELETE FROM wishlist WHERE user_id=?", [user_id]);

  db.query(
    "INSERT INTO orders (user_id, total, address) VALUES (?, ?, ?)",
    [user_id, total, address],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Order failed");
      }

      if (email) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        transporter.sendMail({
          to: email,
          subject: "Order Confirmed",
          text: `Your order ID is ${result.insertId}`
        });
      }

      res.json({ orderId: result.insertId });
    }
  );
});


router.get("/orders/:userId", (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE user_id=?",
    [req.params.userId],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error fetching orders");
      }
      res.json(result);
    }
  );
});

router.get("/products/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send("Error");

      let product = result[0];

      let images = [];

      try {
        images = product.images ? JSON.parse(product.images) : [];
      } catch {
        images = [];
      }

      product.images = images;

      res.json(product);
    }
  );
});

router.get("/cart/:userId", (req, res) => {
  db.query(
    `SELECT cart_items.*, products.name, products.price, products.images, products.image
     FROM cart_items 
     JOIN products ON cart_items.product_id = products.id 
     WHERE user_id=?`,
    [req.params.userId],
    (err, result) => {
      if (err) return res.status(500).send("Error");

      const updated = result.map(p => {
        let images = [];

        try {
          images = p.images ? JSON.parse(p.images) : [];
        } catch {
          images = [];
        }

        return {
          ...p,
          image: images.length > 0 ? images[0] : p.image
        };
      });

      res.json(updated);
    }
  );
});

router.put("/cart/update", (req, res) => {
  const { id, quantity } = req.body;

  db.query(
    "UPDATE cart_items SET quantity=? WHERE id=?",
    [quantity, id],
    (err) => {
      if (err) return res.status(500).send("Error");
      res.send("Updated");
    }
  );
});

router.delete("/cart/remove/:id", (req, res) => {
  db.query(
    "DELETE FROM cart_items WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send("Error");
      res.send("Removed");
    }
  );
});

module.exports = router;
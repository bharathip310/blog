import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { readFileSync } from "fs";

import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, 
  query, orderBy, serverTimestamp 
} from "firebase/firestore/lite";

let db: any = null;
try {
  const firebaseConfig = JSON.parse(readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
} catch (error) {
  console.error("Firebase config not found or invalid", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // RESTful API endpoints for Posts
  app.get("/api/posts", async (req, res) => {
    if (!db) return res.status(500).json({ error: "DB not initialized" });
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(posts);
    } catch (e) {
       console.error("Error fetching posts:", e);
       // Handle missing index if it occurs
       if ((e as Error).message.includes("index")) {
         // Fallback to unstructured
          const snapshot = await getDocs(collection(db, "posts"));
          const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          res.json(posts);
       } else {
         res.status(500).json({ error: (e as Error).message });
       }
    }
  });

  app.post("/api/posts", async (req, res) => {
    if (!db) return res.status(500).json({ error: "DB not initialized" });
    const { title, content, authorId, authorName } = req.body;
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title, content, authorId, authorName, createdAt: Date.now()
      });
      res.json({ id: docRef.id, title, content, authorId, authorName });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.get("/api/posts/:id", async (req, res) => {
    if (!db) return res.status(500).json({ error: "DB not initialized" });
    try {
      const docRef = doc(db, "posts", req.params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        res.json({ id: docSnap.id, ...docSnap.data() });
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.put("/api/posts/:id", async (req, res) => {
    if (!db) return res.status(500).json({ error: "DB not initialized" });
    const { title, content } = req.body;
    try {
      const docRef = doc(db, "posts", req.params.id);
      await updateDoc(docRef, { title, content, updatedAt: Date.now() });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  app.delete("/api/posts/:id", async (req, res) => {
    if (!db) return res.status(500).json({ error: "DB not initialized" });
    try {
      await deleteDoc(doc(db, "posts", req.params.id));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });

  // RESTful API endpoints for Comments
  app.get("/api/posts/:id/comments", async (req, res) => {
    if (!db) return res.status(500).json({ error: "DB not initialized" });
    try {
      const q = query(collection(db, "posts", req.params.id, "comments"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(comments);
    } catch (e) {
      if ((e as Error).message.includes("index")) {
        const snapshot = await getDocs(collection(db, "posts", req.params.id, "comments"));
        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(comments);
      } else {
        res.status(500).json({ error: (e as Error).message });
      }
    }
  });

  app.post("/api/posts/:id/comments", async (req, res) => {
    if (!db) return res.status(500).json({ error: "DB not initialized" });
    const { content, authorId, authorName } = req.body;
    try {
      const docRef = await addDoc(collection(db, "posts", req.params.id, "comments"), {
        content, authorId, authorName, createdAt: Date.now()
      });
      res.json({ id: docRef.id, content, authorId, authorName });
    } catch (e) {
      res.status(500).json({ error: (e as Error).message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

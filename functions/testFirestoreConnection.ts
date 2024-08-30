import express from "express";
import { db } from "./src/firebase";

const app = express();
const port = process.env.PORT || 3000;

app.get("/test", async (req, res) => {
  try {
    const testDoc = db.collection("testCollection").doc("testDoc");
    await testDoc.set({ testField: "testValue" });
    const doc = await testDoc.get();
    res.send(`Document data: ${JSON.stringify(doc.data())}`);
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
    res.status(500).send("Error connecting to Firestore");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

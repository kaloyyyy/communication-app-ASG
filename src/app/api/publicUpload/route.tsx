import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import sqlite3 from 'better-sqlite3';

// Connect to SQLite database
const db = sqlite3('db/identifier.sqlite');

// Create table if it does not exist
db.exec(`
    CREATE TABLE IF NOT EXISTS files (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         chat_sid TEXT NOT NULL,
                                         file_name TEXT NOT NULL,
                                         file_url TEXT NOT NULL,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

// Function to save file information to the database
function saveFileName(chatSid, fileName) {
   const stmt = db.prepare('INSERT INTO files (chat_sid, file_name) VALUES (?, ?)');
   stmt.run(chatSid, fileName);
}

export async function POST(req: Request) {
   try {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const chatSid = formData.get("chatSid") as string;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const filePath = path.join(process.cwd(), 'public/uploads', file.name);
      await fs.writeFile(filePath, buffer);

      const fileUrl = `${process.env.BASE_URL}/uploads/${file.name}`;

      // Save file info to the database
      const stmt = db.prepare('INSERT INTO files (chat_sid, file_name, file_url) VALUES (?, ?, ?)');
      stmt.run(chatSid, file.name, fileUrl);

      return NextResponse.json({ status: 'success', fileUrl });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 'fail', error: error.message });
   }
}
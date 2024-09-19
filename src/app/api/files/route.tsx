import { NextResponse } from 'next/server';
import sqlite3 from 'better-sqlite3';

const db = sqlite3('path/to/your/database.db');

export async function GET(req: Request) {
   try {
      const url = new URL(req.url);
      const chatSid = url.searchParams.get('chatSid');

      if (!chatSid) {
         return NextResponse.json({ status: 'fail', error: 'chatSid is required' });
      }

      const stmt = db.prepare('SELECT file_name, file_url FROM files WHERE chat_sid = ?');
      const files = stmt.all(chatSid);

      return NextResponse.json({ status: 'success', files });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 'fail', error: error.message });
   }
}

import { NextResponse } from 'next/server';

let chats: Record<string, { sender: string; receiver: string; message: string; file?: string }[]> = {};

export async function POST(request: Request) {
   const { sender, receiver, message, file } = await request.json();

   if (!chats[receiver]) {
      chats[receiver] = [];
   }
   chats[receiver].push({ sender, receiver, message, file });

   return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const user = searchParams.get('user');

   return NextResponse.json({ chats: chats[user] || [] });
}

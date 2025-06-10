import { NextRequest, NextResponse } from 'next/server';
import { LoginModel } from '@/app/utils/models/Login'; 
import Db from '@/app/utils/config/db';

export async function POST(req: NextRequest) {
  try {
    await Db();

    const body = await req.json();

    if (!body.username || !body.email || !body.password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const user = await LoginModel.create([
      {
        username: body.username,
        email: body.email,
        password: body.password,
      }
    ]);

    return NextResponse.json({ message: "Signup successful", user });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}

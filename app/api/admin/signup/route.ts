import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '@/app/utils/models/Login'; 
import Db from '@/app/utils/config/db';

export async function POST(req: NextRequest) {
  try {
    Db(); 
    const body = await req.json();
    const user = await AdminModel.create({
      username: body.username,
      email: body.email,
      password: body.password,
    });

    return NextResponse.json({ message: "Signup successful", user });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Signup failed", error });
  }
}
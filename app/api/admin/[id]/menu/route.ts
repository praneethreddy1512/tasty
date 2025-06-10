import { NextRequest, NextResponse } from 'next/server';
import Db from '@/app/utils/config/db';
import { RestaurantModel } from '@/app/utils/models/Login';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await Db();
  const restaurant = await RestaurantModel.findById(params.id);
  if (!restaurant) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  return NextResponse.json(restaurant);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await Db();
  const { name, price, rating, imgurl } = await req.json();
  const updated = await RestaurantModel.findByIdAndUpdate(
    params.id,
    { $push: { menu: { name, price, rating, imgurl } } },
    { new: true }
  );
  return NextResponse.json(updated);
}

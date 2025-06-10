import { NextRequest, NextResponse } from 'next/server';
import Db from '@/app/utils/config/db';
import { RestaurantModel } from '@/app/utils/models/Login';

export async function GET() {
  await Db();
  const restaurants = await RestaurantModel.find();
  return NextResponse.json(restaurants);
}

export async function POST(req: NextRequest) {
  await Db();
  const body = await req.json();
  const newRestaurant = await RestaurantModel.create(body);
  return NextResponse.json(newRestaurant);
}
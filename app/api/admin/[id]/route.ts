import { NextRequest, NextResponse } from 'next/server';
import Db from '@/app/utils/config/db';
import { RestaurantModel } from '@/app/utils/models/Login';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await Db();
  const data = await req.json();
  const updated = await RestaurantModel.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await Db();
  const deleted = await RestaurantModel.findByIdAndDelete(params.id);
  return NextResponse.json(deleted);
}
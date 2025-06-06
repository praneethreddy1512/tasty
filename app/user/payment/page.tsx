import Navbar from '@/app/navbar/page';
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
      <div className="bg-green-100 rounded-full p-4 mb-4">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold mb-2">Payment Successful</h1>
      <p className="text-gray-600">Thank you for ordering</p>
      <p className="text-gray-600 mb-6">Your payment is successfully completed.</p>
      <Link href="/user/home">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm">
          Go To Home Page
        </button>
      </Link>
    </div>
    </>
  );
}

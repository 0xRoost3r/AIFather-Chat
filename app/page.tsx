import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to default subdomain
  redirect('/gen8');
} 
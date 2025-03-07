import { headers } from 'next/headers';
import { BrandProvider } from './components/BrandContext';
import ChatInterface from './components/ChatInterface';

export default function HomePage() {
  const headersList = headers();
  const subdomain = headersList.get('x-subdomain') || 'gen8';
  
  console.log(`Home page rendering for subdomain: ${subdomain}`);
  
  return (
    <BrandProvider subdomain={subdomain}>
      <ChatInterface />
    </BrandProvider>
  );
} 
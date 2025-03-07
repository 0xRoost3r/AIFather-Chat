import { headers } from 'next/headers';
import { BrandProvider } from '../components/BrandContext';
import ChatInterface from '../components/ChatInterface';

export default function DomainPage({ params }: { params: { domain: string } }) {
  const headersList = headers();
  // Ưu tiên sử dụng subdomain từ header, nếu không có thì sử dụng từ params
  const subdomain = headersList.get('x-subdomain') || params.domain || 'gen8';
  
  console.log(`Domain page rendering for subdomain: ${subdomain}`);
  
  return (
    <BrandProvider subdomain={subdomain}>
      <ChatInterface />
    </BrandProvider>
  );
} 
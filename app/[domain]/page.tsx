import { BrandProvider } from '../components/BrandContext';
import ChatInterface from '../components/ChatInterface';

export default function DomainPage({ params }: { params: { domain: string } }) {
  const subdomain = params.domain;
  
  console.log(`Rendering page for subdomain: ${subdomain}`);
  
  return (
    <BrandProvider subdomain={subdomain}>
      <ChatInterface />
    </BrandProvider>
  );
} 
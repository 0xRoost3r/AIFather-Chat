# AIFather AI - The Godfather of Onchain ChatBots

A modern AI chat application built with Next.js 14, supporting dynamic subdomains and real-time streaming responses using X Grok 2's Generative AI.

## Features

- 🌐 Dynamic subdomain support (e.g., gen8.domain.com, gen9.domain.com)
- 🤖 Integration with Google Generative AI
- 💬 Real-time streaming text responses
- 🎨 Beautiful UI with Tailwind CSS and Framer Motion
- 🌙 Dark mode optimized
- 📱 Fully responsive design
- 🔒 Token-based access control
- ✨ Markdown support with syntax highlighting
- 🔄 Smooth animations and transitions

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** 
  - Framer Motion for animations
  - Lucide Icons
  - React Markdown for content rendering
- **AI Integration:** Google Generative AI
- **Development:** 
  - ESLint
  - Prettier
  - TypeScript strict mode

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/0xRoost3r/AIFather-Chat.git
cd AIFather-Chat
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
XAI_API_KEY=your_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
```
gen8-ai/
├── app/
│ ├── api/
│ │ └── [domain]/
│ │ └── chat/
│ │ └── route.ts
│ ├── components/
│ │ ├── BrandContext.tsx
│ │ ├── ChatInterface.tsx
│ │ ├── MarkdownContent.tsx
│ │ └── TokenCard.tsx
│ ├── hooks/
│ │ └── useWindowSize.ts
│ ├── layout.tsx
│ └── page.tsx
├── middleware.ts
└── public/
```

## Key Components

- **ChatInterface:** Main chat UI component with streaming text support
- **MarkdownContent:** Renders markdown content with syntax highlighting
- **TokenCard:** Displays user token information and usage
- **BrandContext:** Manages brand-specific theming per subdomain

## API Routes

- **POST /api/[domain]/chat**
  - Handles chat requests for specific subdomains
  - Supports streaming responses
  - Integrates with X.AI GROK 2

## Deployment

This application is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Set up environment variables
4. Configure custom domains and subdomains

### Subdomain Setup

1. Add your domain to Vercel
2. Configure wildcard DNS records:
.yourdomain.com CNAME vercel.app

## Environment Variables

Required environment variables:
- `XAI_API_KEY`: Your GROK API key

## Development Guidelines

1. **Styling:**
   - Use Tailwind classes for styling
   - Follow the established color scheme from BrandContext
   - Maintain responsive design principles

2. **Components:**
   - Keep components modular and reusable
   - Use TypeScript interfaces for props
   - Implement proper error handling

3. **API Routes:**
   - Include proper error handling
   - Use TypeScript for type safety
   - Implement rate limiting where necessary

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
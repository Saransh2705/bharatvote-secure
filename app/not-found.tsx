import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center govt-section">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-heading font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" /> Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

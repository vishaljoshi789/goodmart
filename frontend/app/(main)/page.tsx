import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function Home() {
  return (
    <div>
      <Alert variant="default">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
      <h1>Home</h1>
      <p>Home page</p>
    </div>
  );
}

import { useGetAllSubmissions } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { PaymentStatus } from '../backend';

export default function AdminSubmissionsView() {
  const { data: submissions, isLoading, error } = useGetAllSubmissions();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          Only administrators can view submissions. Please ensure you're logged in with admin privileges.
          <br />
          <span className="text-xs mt-2 block">
            Tip: Add <code className="bg-destructive/20 px-1 rounded">?caffeineAdminToken=YOUR_TOKEN</code> to the URL
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  const formatDate = (timestamp?: bigint) => {
    if (!timestamp) return 'N/A';
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Submissions</CardTitle>
        <CardDescription>
          View all lead submissions and payment statuses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submissions || submissions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No submissions yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Renewal Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id.toString()}>
                    <TableCell className="font-mono text-xs">
                      {submission.id.toString()}
                    </TableCell>
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell>{submission.email}</TableCell>
                    <TableCell>{submission.whatsapp}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.paymentStatus === PaymentStatus.paid
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          submission.paymentStatus === PaymentStatus.paid
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : ''
                        }
                      >
                        {submission.paymentStatus === PaymentStatus.paid ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(submission.timestamp)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(submission.paymentDate)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(submission.renewalDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

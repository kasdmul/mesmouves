import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const postings = [
  { title: "Senior Frontend Engineer", department: "Engineering", status: "Open", applicants: 78 },
  { title: "Product Manager", department: "Product", status: "Open", applicants: 120 },
  { title: "UX/UI Designer", department: "Design", status: "Interviewing", applicants: 95 },
  { title: "Data Scientist", department: "Data", status: "Open", applicants: 55 },
  { title: "HR Generalist", department: "People", status: "Closed", applicants: 210 },
];

const getBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" | null | undefined => {
  switch (status) {
    case "Open":
      return "default";
    case "Interviewing":
      return "secondary";
    case "Closed":
      return "outline";
    default:
      return "outline";
  }
};

export function JobPostings() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Current Job Postings</CardTitle>
        <CardDescription>Overview of all company job listings.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <div className="relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postings.map((post) => (
                <TableRow key={post.title}>
                  <TableCell>
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-muted-foreground">{post.department}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(post.status)}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{post.applicants}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

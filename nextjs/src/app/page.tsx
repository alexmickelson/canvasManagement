import { canvasAssignmentService } from "@/services/canvas/canvasAssignmentService";
import Image from "next/image";

export default async function Home() {
  const assignments = await canvasAssignmentService.getAll(960410);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {assignments.map((assignment) => (
        <div key={assignment.id}>{assignment.name}</div>
      ))}
    </main>
  );
}

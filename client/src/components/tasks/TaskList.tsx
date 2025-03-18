import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

interface TaskListProps {
  tasks: string[];
  onAddTask: (task: string) => void;
}

export function TaskList({ tasks, onAddTask }: TaskListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-primary">Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 bg-background/50 backdrop-blur-sm border-primary/20 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="text-sm">{task}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <Textarea
        className="mt-4 bg-background/50 backdrop-blur-sm border-primary/20"
        placeholder="Add a new task..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            const target = e.target as HTMLTextAreaElement;
            if (target.value.trim()) {
              onAddTask(target.value);
              target.value = "";
            }
          }
        }}
      />
    </motion.div>
  );
}

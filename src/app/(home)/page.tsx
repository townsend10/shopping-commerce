import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Button variant={"elevated"}>Butao</Button>
      </div>
      <div>
        <Input placeholder="input por" />
      </div>
      <div>
        <Progress value={50} />
      </div>
      <div>
        <Textarea placeholder="text area" />
      </div>
      <div>
        <Checkbox />
      </div>
    </div>
  );
}

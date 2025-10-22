import * as React from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchUsers, addUser } from "@/store/usersSlice";

export const AddUserDialog = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("client_admin");
  const [loading, setLoading] = React.useState(false);

  const handleAddUser = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await dispatch(addUser({ email, password, roles: [role] })).unwrap();
      toast({
        title: "Success",
        description: "User added successfully"
      });

      // Refresh users list
      dispatch(fetchUsers());

      setEmail("");
      setPassword("");
      setRole("client_admin");
      setOpen(false); // close dialog
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter email, password, and role for the new user.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Select
            value={role}
            onValueChange={(value) => setRole(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="platform_admin">Platform Admin</SelectItem>
              <SelectItem value="client_admin">Client Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddUser} disabled={loading}>
            {loading ? "Adding..." : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

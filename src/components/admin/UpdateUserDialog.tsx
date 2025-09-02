import * as React from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import { updateUser, fetchUsers } from "@/store/usersSlice";
import { Edit } from "lucide-react";

interface UpdateUserDialogProps {
  user: { _id: string; email: string; roles: string[]; allowedTabs?: string[] };
}

const availableRoles = ["platform_admin", "client_admin"];
const availableTabs = [
  "assessments",
  "leads",
  "analytics",
  "voice settings",
  "settings",
];

export const UpdateUserDialog: React.FC<UpdateUserDialogProps> = ({ user }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const rolesFromStorage = JSON.parse(localStorage.getItem("roles") || "[]");

  // Hide dialog for non-admins
  if (!rolesFromStorage.includes("platform_admin")) return null;

  const [open, setOpen] = React.useState(false);
  const [roles, setRoles] = React.useState<string[]>(user.roles || []);
  const [allowedTabs, setAllowedTabs] = React.useState<string[]>(
    user.allowedTabs || []
  );
  const [loading, setLoading] = React.useState(false);

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateUser({
          id: user._id,
          roles,
          allowedTabs,
        })
      ).unwrap();
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      dispatch(fetchUsers()); // refresh users list
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = (role: string) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleTab = (tab: string) => {
    setAllowedTabs((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Update User">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User: {user.email}</DialogTitle>
          <DialogDescription>
            Modify the roles and allowed tabs for this user.
          </DialogDescription>
        </DialogHeader>

        {/* Roles */}
        <div className="grid gap-2 py-4">
          <Label className="font-medium">Roles</Label>
          {availableRoles.map((role) => (
            <div className="flex items-center space-x-2 mt-2" key={role}>
              <Checkbox
                id={role}
                name={role}
                checked={roles.includes(role)}
                onCheckedChange={() => toggleRole(role)}
              />
              <Label htmlFor={role} className="select-none">
                {role.replace("_", " ").toUpperCase()}
              </Label>
            </div>
          ))}
        </div>

        {/* Allowed Tabs */}
        <div className="grid gap-2 py-4">
          <Label className="font-medium">Allowed Tabs</Label>
          {availableTabs.map((tab) => (
            <div className="flex items-center space-x-2 mt-2" key={tab}>
              <Checkbox
                id={tab}
                name={tab}
                checked={allowedTabs.includes(tab)}
                onCheckedChange={() => toggleTab(tab)}
              />
              <Label htmlFor={tab} className="select-none capitalize">
                {tab}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpdateUser} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

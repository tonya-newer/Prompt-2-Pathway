
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '@/store/usersSlice';
import { RootState } from '@/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddUserDialog } from '@/components/admin/AddUserDialog';
import { UpdateUserDialog } from '@/components/admin/UpdateUserDialog';

export const Users = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const users = useSelector((state: RootState) => state.users.list);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => {
    return user.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await dispatch(deleteUser(id)).unwrap();
      toast({ title: 'Deleted', description: 'User deleted successfully' });
    } catch (err: any) {
      toast({ title: 'Error', description: 'Failed to delete user' });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Users</h3>
        <AddUserDialog />
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search Users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Allowed Tabs</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.roles.join(', ').replace("_", " ").toUpperCase()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.allowedTabs.map((tab, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tab.replace("_", " ").toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <UpdateUserDialog user={user} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

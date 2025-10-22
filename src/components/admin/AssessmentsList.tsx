import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Copy, Trash2, Link } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import {
  fetchAssessments,
  duplicateAssessment,
  removeAssessment,
} from '@/store/assessmentsSlice';

export const AssessmentsList = () => {
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();

	const { list, status, error } = useSelector((state: RootState) => state.assessments);

  const { toast } = useToast();

	// Fetch assessments on mount
  useEffect(() => {
    dispatch(fetchAssessments());
  }, [dispatch]);

	const handleCreate = () => {
    navigate('/assessment/add')
    toast({
      title: "New Template",
      description: "Creating new assessment template",
    });
  };

	const handleEdit = (assessment) => {
    navigate(`/assessment/update/${assessment.slug}`);
  };

	const handleDuplicate = async (assessment) => {
    try {
      await dispatch(duplicateAssessment(assessment._id)).unwrap();
      toast({ title: 'Duplicated', description: 'Assessment duplicated successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to duplicate assessment' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await dispatch(removeAssessment(id)).unwrap();
      toast({ title: 'Deleted', description: 'Assessment deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete assessment' });
    }
  };

  const copyAssessmentLink = (assessment) => {
    navigator.clipboard.writeText(`${window.location.origin}/assessment/${assessment.slug}`);
    toast({ title: 'Copied', description: 'Assessment URL copied to clipboard' });
  };

	// Loading/Error UI
  if (status === 'loading') return <p>Loading assessments...</p>;
  if (status === 'failed') return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Available Assessments</h3>
				<Button onClick={handleCreate} className="flex items-center">
					<Plus className="h-4 w-4 mr-2" />
					Create New
				</Button>
			</div>
			
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{list.map((assessment) => (
					<Card key={assessment._id} className="overflow-hidden">
						{assessment.image && (
							<div className="h-48 overflow-hidden">
								<img 
									src={assessment.image} 
									alt={assessment.title}
									className="w-full h-full object-cover"
								/>
							</div>
						)}
						<div className="p-6">
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1">
									<h4 className="font-semibold text-lg mb-2">{assessment.title}</h4>
									<p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
									
									<div className="flex flex-wrap gap-1 mb-3">
										<Badge variant={assessment.audience === 'business' ? 'default' : 'secondary'}>
											{assessment.audience}
										</Badge>
										{assessment.tags.map((tag, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>
									
									<p className="text-xs text-gray-500 mb-4">
										{assessment.questions.length} questions • Est. {Math.ceil(assessment.questions.length * 0.75)} min
									</p>
									
									<div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
										<p className="text-sm font-medium text-blue-900 mb-1">Public Link:</p>
										<code className="text-xs bg-white px-2 py-1 rounded border block w-full text-gray-700 break-all">
											{window.location.origin}/assessment/{assessment.slug}
										</code>
									</div>
								</div>
							</div>
							
							<div className="flex flex-wrap gap-2">
								<Button 
									size="sm"
									onClick={() => copyAssessmentLink(assessment)}
									className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
								>
									<Link className="h-3 w-3" />
									Copy URL
								</Button>
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => handleEdit(assessment)}
								>
									<Edit className="h-3 w-3 mr-1" />
									Edit
								</Button>
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => handleDuplicate(assessment)}
								>
									<Copy className="h-3 w-3 mr-1" />
									Duplicate
								</Button>
								<Button 
									variant="outline" 
									size="sm"
									onClick={() => handleDelete(assessment._id)}
									className="text-red-600 hover:text-red-700"
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						</div>
					</Card>
				))}
			</div>
    </div>
  );
};

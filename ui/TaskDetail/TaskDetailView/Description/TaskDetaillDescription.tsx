'use client'
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { handleEditTask } from "@/actions/TaskServerActions";
import { EditTaskSchema } from '@/types/zodTypes';
import { ExpandedTask, TaskEditData } from '@/types/types';
import { Textarea } from "@nextui-org/input";
import { Button, ButtonGroup } from '@nextui-org/button';
import { IconTextPlus, IconLoader2, IconX, IconTrash } from '@tabler/icons-react';

export default function TaskDetailDescription({ 
    selectedTask, boardId
} : {
    selectedTask: ExpandedTask; boardId: string;
}) {
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const toggleEditDescription = () => setIsEditingDescription(!isEditingDescription);

    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<TaskEditData>({
        resolver: zodResolver(EditTaskSchema),
        defaultValues: { id: selectedTask.id, boardId, description: selectedTask.description }
    });

    const onSubmit: SubmitHandler<TaskEditData> = async (data) => {
        const response = await handleEditTask(data);
        
        if (response.success) {
            toast.success('Description Updated');
            reset({ ...data, description: data.description });
            setIsEditingDescription(false);
        } else {
            toast.error(response.message);
        }
    };

    return (
        <div className='flex gap-3 w-full'>
            <IconTextPlus size={32} />
            <div className='flex-col w-full'>
            <h4 className='text-large font-semibold mb-2'>Description</h4>
            {!isEditingDescription ? (
                <p onClick={toggleEditDescription} className="cursor-pointer">
                    {selectedTask.description ? (
                        selectedTask.description
                    ) : (
                        <span className="text-primary">Add a description</span>
                    )}
                </p>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register('id')} />
                    <input type="hidden" {...register('boardId')} />
                    <Textarea 
                        placeholder="Enter your description"
                        autoFocus
                        label="Description"
                        defaultValue={selectedTask.description || ''}
                        className='w-full mb-2 mt-1 border-none focus:outline-none' 
                        {...register('description')}
                    />
                    <div className='flex gap-2'>
                        <Button 
                            type='submit' 
                            disabled={isSubmitting}
                            size='sm'
                            className="flex justify-center items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <IconLoader2 size={16} className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : 'Save'}
                        </Button>
                        <Button 
                            size='sm'
                            onClick={toggleEditDescription} 
                            type="button" 
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            )}
            </div>
        </div>
    )
}

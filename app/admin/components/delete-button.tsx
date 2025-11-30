'use client';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { apiDelete } from '@/lib/api/instance';

interface DeleteButtonProps {
  id: string;
  token: string;
}

const DeleteButton = ({ id, token }: DeleteButtonProps) => {
  const handleClick = async () => {
    try {
        await apiDelete(`/posts/${id}`, token);
        window.location.reload();
    } catch (error: any) {
        alert(`Erro: ${error.message}`);
    }
  };

  return (
    <Button
      size="icon"
      variant="destructive"
      aria-label="Deletar case"
      onClick={handleClick}
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
};

export default DeleteButton;
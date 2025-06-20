'use client';

import { useRef } from 'react';
import Papa from 'papaparse';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChangePasswordDialog } from './change-password-dialog';
import { Upload } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export function Header() {
  const { toast } = useToast();
  const { userData } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log("Parsed CSV data:", result.data);
          toast({
            title: "Importation réussie",
            description: `${result.data.length} enregistrements ont été chargés.`,
          });
        },
        header: true,
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast({
            variant: "destructive",
            title: "Erreur d'importation",
            description: "Le fichier CSV n'a pas pu être analysé.",
          });
        },
      });
    }
     // Reset file input value to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const userHasImportPermission = userData?.role === 'admin' || userData?.role === 'superadmin';

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-end border-b bg-card px-4 md:px-6">
       <input
        type="file"
        id="csvFileInput"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={handleFileChange}
      />
      <div className="flex items-center gap-4">
        {userHasImportPermission && (
          <Button variant="outline" onClick={handleImportClick}>
              <Upload className="mr-2 h-4 w-4" />
              Importer CSV
          </Button>
        )}
        <ChangePasswordDialog />
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {userData?.displayName || 'Utilisateur'}
        </span>
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" alt="User Avatar" />
          <AvatarFallback>{userData?.displayName?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

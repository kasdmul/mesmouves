'use client';

import { useRef } from 'react';
import Papa from 'papaparse';
import { usePathname } from 'next/navigation';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
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
  const pathname = usePathname();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !db) return;

    // Reset file input to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }

    let collectionName = '';
    if (pathname.startsWith('/dashboard/recruitment')) {
        collectionName = 'candidates';
    } else if (pathname.startsWith('/dashboard/personnel')) {
        collectionName = 'employees';
    }

    if (!collectionName) {
        toast({
            variant: "destructive",
            title: "Importation non disponible",
            description: "Importez depuis les pages Recrutement ou Personnel.",
        });
        return;
    }

    const currentCollection = collectionName; // To use in the callback

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
            if (!result.data || result.data.length === 0) {
                 toast({ variant: "destructive", title: "Fichier vide", description: "Le fichier CSV ne contient aucune donnée." });
                 return;
            }
            
            try {
                const batch = writeBatch(db);
                let validRows = 0;
                result.data.forEach((row: any) => {
                    const hasRequiredFields = currentCollection === 'candidates' 
                        ? row.name && row.email && row.position
                        : row.name && row.email && row.position && row.department;
                    
                    if (hasRequiredFields) {
                        const docRef = doc(collection(db, currentCollection));
                        batch.set(docRef, row);
                        validRows++;
                    }
                });

                if (validRows === 0) {
                     toast({ variant: "destructive", title: "Aucune donnée valide", description: "Vérifiez que les colonnes du CSV correspondent." });
                     return;
                }

                await batch.commit();
                
                toast({
                    title: "Importation réussie",
                    description: `${validRows} enregistrements ont été importés dans ${currentCollection}.`,
                });

            } catch (error) {
                console.error("Error importing data:", error);
                toast({
                    variant: "destructive",
                    title: "Erreur d'importation",
                    description: "Une erreur s'est produite lors de l'enregistrement des données.",
                });
            }
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          toast({
            variant: "destructive",
            title: "Erreur d'importation",
            description: "Le fichier CSV n'a pas pu être analysé.",
          });
        },
      });
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

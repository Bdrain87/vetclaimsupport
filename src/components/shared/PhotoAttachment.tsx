import { useRef } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface PhotoAttachmentProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoAttachment({ photos, onPhotosChange, maxPhotos = 5 }: PhotoAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (photos.length + files.length > maxPhotos) {
      toast({
        title: 'Too Many Photos',
        description: `Maximum ${maxPhotos} photos allowed.`,
        variant: 'destructive',
      });
      return;
    }

    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select only image files.',
          variant: 'destructive',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File Too Large',
          description: 'Photos must be under 5MB.',
          variant: 'destructive',
        });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      Promise.all(
        validFiles.map(file => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }))
      ).then(newDataUrls => {
        onPhotosChange([...photos, ...newDataUrls]);
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Photo Attachments
        </span>
        <span className="text-xs text-muted-foreground">
          {photos.length}/{maxPhotos}
        </span>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((photo, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div
                  className="relative w-16 h-16 rounded-lg overflow-hidden cursor-pointer border border-border hover:border-primary transition-colors"
                >
                  <img 
                    src={photo} 
                    alt={`Attachment ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs hover:bg-destructive/90"
                    aria-label="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Photo {index + 1}</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center">
                  <img 
                    src={photo} 
                    alt={`Attachment ${index + 1}`} 
                    className="max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {/* Add Photo Button */}
      {photos.length < maxPhotos && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Photos
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Photos are encrypted and stored securely. Max 5MB per photo.
      </p>
    </div>
  );
}

// Simplified thumbnail display for viewing entries
interface PhotoThumbnailsProps {
  photos: string[];
}

export function PhotoThumbnails({ photos }: PhotoThumbnailsProps) {
  if (photos.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {photos.map((photo, index) => (
        <Dialog key={index}>
          <DialogTrigger asChild>
            <div className="w-10 h-10 rounded overflow-hidden cursor-pointer border border-border hover:border-primary transition-colors">
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Photo {index + 1}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <img 
                src={photo} 
                alt={`Photo ${index + 1}`} 
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}

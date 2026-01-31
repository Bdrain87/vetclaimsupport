import { useState } from 'react';
import { useClaims } from '@/context/ClaimsContext';
import { Users, Plus, Trash2, Edit, Phone, Mail, FileText, CheckCircle, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BuddyContact } from '@/types/claims';

const statementStatuses = ['Not Requested', 'Requested', 'Received', 'Submitted'] as const;

export default function BuddyContacts() {
  const { data, addBuddyContact, updateBuddyContact, deleteBuddyContact } = useClaims();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<BuddyContact, 'id'>>({
    name: '',
    rank: '',
    relationship: '',
    whatTheyWitnessed: '',
    contactInfo: '',
    statementStatus: 'Not Requested',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      rank: '',
      relationship: '',
      whatTheyWitnessed: '',
      contactInfo: '',
      statementStatus: 'Not Requested',
    });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBuddyContact(editingId, formData);
    } else {
      addBuddyContact(formData);
    }
    setIsOpen(false);
    resetForm();
  };

  const handleEdit = (contact: BuddyContact) => {
    setFormData({
      name: contact.name,
      rank: contact.rank,
      relationship: contact.relationship,
      whatTheyWitnessed: contact.whatTheyWitnessed,
      contactInfo: contact.contactInfo,
      statementStatus: contact.statementStatus,
    });
    setEditingId(contact.id);
    setIsOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Received': return <FileText className="h-4 w-4 text-primary" />;
      case 'Requested': return <Clock className="h-4 w-4 text-warning" />;
      default: return <Send className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-success/10 text-success ring-success/20';
      case 'Received': return 'bg-primary/10 text-primary ring-primary/20';
      case 'Requested': return 'bg-warning/10 text-warning ring-warning/20';
      default: return 'bg-muted text-muted-foreground ring-border';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="section-header mb-0">
          <div className="section-icon bg-buddy/10">
            <Users className="h-5 w-5 text-buddy" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Buddy Contacts</h1>
            <p className="text-muted-foreground">Manage witness contacts for buddy statements</p>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Contact' : 'Add Buddy Contact'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input 
                    id="rank" 
                    placeholder="e.g., TSgt"
                    value={formData.rank}
                    onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input 
                  id="relationship" 
                  placeholder="e.g., Flight supervisor, fellow crew member"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="witnessed">What They Witnessed</Label>
                <Textarea 
                  id="witnessed" 
                  placeholder="Describe what conditions/incidents they can verify..."
                  value={formData.whatTheyWitnessed}
                  onChange={(e) => setFormData({ ...formData, whatTheyWitnessed: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Info</Label>
                <Input 
                  id="contact" 
                  placeholder="Email, phone, or address"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statement Status</Label>
                <Select 
                  value={formData.statementStatus} 
                  onValueChange={(value: typeof statementStatuses[number]) => setFormData({ ...formData, statementStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statementStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? 'Update' : 'Save'} Contact
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Contacts Grid */}
      {data.buddyContacts.length === 0 ? (
        <Card className="data-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">No buddy contacts yet.</p>
            <p className="text-sm text-muted-foreground text-center mt-1">Add fellow airmen who can provide witness statements.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.buddyContacts.map((contact) => (
            <Card key={contact.id} className="data-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(contact.statementStatus)}
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(contact.statementStatus)}`}>
                      {contact.statementStatus}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(contact)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteBuddyContact(contact.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-base mt-2">
                  {contact.rank && `${contact.rank} `}{contact.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {contact.relationship && (
                  <p className="text-muted-foreground">{contact.relationship}</p>
                )}
                
                {contact.whatTheyWitnessed && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Can Verify</p>
                    <p className="text-sm">{contact.whatTheyWitnessed}</p>
                  </div>
                )}

                {contact.contactInfo && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {contact.contactInfo.includes('@') ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )}
                    <span className="text-xs truncate">{contact.contactInfo}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

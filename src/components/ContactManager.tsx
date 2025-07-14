import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Plus, Phone, User, Star } from 'lucide-react';
import { t } from '@/utils/localization';
import { useToast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Mama Sarah',
      phone: '+254712345678',
      relationship: 'Mother',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Dr. Wanjiku',
      phone: '+254723456789',
      relationship: 'Friend',
      isPrimary: false
    }
  ]);
  
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  });

  const resetForm = () => {
    setFormData({ name: '', phone: '', relationship: '', isPrimary: false });
    setEditingContact(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      toast({
        title: t('form.error'),
        description: t('form.required'),
        variant: "destructive",
      });
      return;
    }

    const phoneRegex = /^\+254[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: t('form.error'),
        description: t('form.invalidPhone'),
        variant: "destructive",
      });
      return;
    }

    if (editingContact) {
      setContacts(prev => prev.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...formData }
          : contact
      ));
      toast({
        title: t('form.success'),
        description: `${t('contacts.editContact')} ${formData.name}`,
      });
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData
      };
      setContacts(prev => [...prev, newContact]);
      toast({
        title: t('form.success'),
        description: `${t('contacts.addContact')} ${formData.name}`,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isPrimary: contact.isPrimary
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
    toast({
      title: t('contacts.delete'),
      description: t('form.success'),
    });
  };

  const callContact = (phone: string, name: string) => {
    window.open(`tel:${phone}`, '_self');
    toast({
      title: `${t('actions.call')} ${name}`,
      description: phone,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('contacts.title')}</h2>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('contacts.addContact')}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? t('contacts.editContact') : t('contacts.addContact')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('contacts.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Mama Sarah"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">{t('contacts.phone')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+254712345678"
                />
              </div>
              
              <div>
                <Label htmlFor="relationship">{t('contacts.relationship')}</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mother">Mother / Mama</SelectItem>
                    <SelectItem value="Father">Father / Baba</SelectItem>
                    <SelectItem value="Sister">Sister / Dada</SelectItem>
                    <SelectItem value="Brother">Brother / Kaka</SelectItem>
                    <SelectItem value="Friend">Friend / Rafiki</SelectItem>
                    <SelectItem value="Partner">Partner / Mwenza</SelectItem>
                    <SelectItem value="Doctor">Doctor / Daktari</SelectItem>
                    <SelectItem value="Other">Other / Mwingine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPrimary">{t('contacts.primary')}</Label>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  {t('contacts.save')}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  {t('contacts.cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>{contact.name}</span>
                  {contact.isPrimary && (
                    <Star className="h-4 w-4 text-warning fill-warning" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => callContact(contact.phone, contact.name)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t('contacts.phone')}: {contact.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('contacts.relationship')}: {contact.relationship}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t('status.noData')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your emergency contacts to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
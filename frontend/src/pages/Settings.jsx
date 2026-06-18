import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

function Settings() {
    const { user } = useContext(AuthContext);
    
    // Local State for forms (simulating editability before API integration)
    const [profileData, setProfileData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        username: user?.username || ''
    });

    const [businessData, setBusinessData] = useState({
        company_name: '',
        address: '',
        currency: 'KSh',
        tax_rate: '16',
        quote_prefix: 'QQ-'
    });

    const [securityData, setSecurityData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [integrations, setIntegrations] = useState({
        mpesa: false,
        whatsapp: false
    });

    const handleSaveProfile = (e) => {
        e.preventDefault();
        // Placeholder for API call
        console.log('Saved profile:', profileData);
    };

    const handleSaveBusiness = (e) => {
        e.preventDefault();
        // Placeholder for API call
        console.log('Saved business:', businessData);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your account settings, business preferences, and integrations.
                </p>
            </div>
            
            <Separator className="my-6" />

            <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
                <TabsList className="flex md:flex-col h-auto items-stretch justify-start gap-1 bg-transparent p-0 w-full md:w-48 shrink-0">
                    <TabsTrigger value="profile" className="justify-start px-4 py-2.5 data-[state=active]:bg-muted/50 data-[state=active]:shadow-none w-full text-left">
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="business" className="justify-start px-4 py-2.5 data-[state=active]:bg-muted/50 data-[state=active]:shadow-none w-full text-left">
                        Business Details
                    </TabsTrigger>
                    <TabsTrigger value="security" className="justify-start px-4 py-2.5 data-[state=active]:bg-muted/50 data-[state=active]:shadow-none w-full text-left">
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="justify-start px-4 py-2.5 data-[state=active]:bg-muted/50 data-[state=active]:shadow-none w-full text-left">
                        Integrations
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 w-full">
                    {/* Profile Tab */}
                    <TabsContent value="profile" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal details and public profile.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First Name</Label>
                                            <Input id="first_name" value={profileData.first_name} onChange={e => setProfileData({...profileData, first_name: e.target.value})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last Name</Label>
                                            <Input id="last_name" value={profileData.last_name} onChange={e => setProfileData({...profileData, last_name: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" disabled value={profileData.username} className="bg-muted" />
                                        <p className="text-xs text-muted-foreground">Your username cannot be changed.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
                                    </div>
                                    <Button type="submit" className="mt-4">Save Changes</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Business Details Tab */}
                    <TabsContent value="business" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>Business Settings</CardTitle>
                                <CardDescription>Configure the details that appear on your generated quotes and invoices.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSaveBusiness} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">Company Name</Label>
                                        <Input id="company_name" placeholder="e.g. Acme Corp" value={businessData.company_name} onChange={e => setBusinessData({...businessData, company_name: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Business Address</Label>
                                        <Textarea id="address" placeholder="123 Business St..." value={businessData.address} onChange={e => setBusinessData({...businessData, address: e.target.value})} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border mt-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="currency">Default Currency</Label>
                                            <Input id="currency" value={businessData.currency} onChange={e => setBusinessData({...businessData, currency: e.target.value})} />
                                            <p className="text-xs text-muted-foreground">Used for all new quotes.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tax_rate">Default Tax Rate (%)</Label>
                                            <Input id="tax_rate" type="number" value={businessData.tax_rate} onChange={e => setBusinessData({...businessData, tax_rate: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="quote_prefix">Quote Prefix</Label>
                                        <Input id="quote_prefix" value={businessData.quote_prefix} onChange={e => setBusinessData({...businessData, quote_prefix: e.target.value})} />
                                        <p className="text-xs text-muted-foreground">Prefix for your quote numbers (e.g. QQ-0001).</p>
                                    </div>

                                    <Button type="submit" className="mt-4">Update Business Settings</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Card className="border-border border-destructive/20">
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>Update your password to keep your account secure.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_pwd">Current Password</Label>
                                        <Input id="current_pwd" type="password" value={securityData.current_password} onChange={e => setSecurityData({...securityData, current_password: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new_pwd">New Password</Label>
                                        <Input id="new_pwd" type="password" value={securityData.new_password} onChange={e => setSecurityData({...securityData, new_password: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm_pwd">Confirm New Password</Label>
                                        <Input id="confirm_pwd" type="password" value={securityData.confirm_password} onChange={e => setSecurityData({...securityData, confirm_password: e.target.value})} />
                                    </div>
                                    <Button type="submit" variant="destructive" className="mt-4">Update Password</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Integrations Tab */}
                    <TabsContent value="integrations" className="m-0 focus-visible:ring-0 focus-visible:outline-none">
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle>App Integrations</CardTitle>
                                <CardDescription>Connect QuickQuote Pro with external services.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-base">M-Pesa STK Push</Label>
                                        <p className="text-sm text-muted-foreground">Allow customers to pay invoices instantly via M-Pesa.</p>
                                    </div>
                                    <Switch checked={integrations.mpesa} onCheckedChange={c => setIntegrations({...integrations, mpesa: c})} />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex flex-col space-y-1">
                                        <Label className="text-base">WhatsApp Delivery</Label>
                                        <p className="text-sm text-muted-foreground">Send quotes and invoices directly to clients via WhatsApp.</p>
                                    </div>
                                    <Switch checked={integrations.whatsapp} onCheckedChange={c => setIntegrations({...integrations, whatsapp: c})} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}

export default Settings;

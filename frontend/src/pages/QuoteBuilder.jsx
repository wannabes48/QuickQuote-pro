import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Briefcase, Paintbrush, Wrench, FileText } from 'lucide-react';
import { quoteTemplates } from '../lib/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function QuoteBuilder() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [isTemplateSelected, setIsTemplateSelected] = useState(false);
    
    // Simulate fetching templates from an API
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);

    const [formData, setFormData] = useState({
        customer: '',
        quote_number: `Q-${Math.floor(Math.random() * 10000)}`,
        status: 'Draft',
        currency: 'KSh',
        notes: ''
    });
    const [items, setItems] = useState([]);

    useEffect(() => {
        api.get('customers/').then(res => setCustomers(res.data));
        
        // Simulate API fetch for templates
        setTimeout(() => {
            setTemplates(quoteTemplates);
            setLoadingTemplates(false);
        }, 600); // Small delay to simulate network
    }, []);

    const handleSelectTemplate = (template) => {
        // Deep copy items to avoid mutating
        setItems(template.items.map(item => ({...item})));
        setFormData(prev => ({ ...prev, notes: template.notes }));
        setIsTemplateSelected(true);
    };

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                items: items
            };
            await api.post('quotes/', data);
            navigate('/quotes');
        } catch (error) {
            console.error("Failed to create quote", error);
            alert("Failed to create quote. Check inputs.");
        }
    };

    const subtotal = calculateSubtotal();
    const vat = subtotal * 0.16;
    const total = subtotal + vat;

    // --- TEMPLATE SELECTION VIEW ---
    if (!isTemplateSelected) {
        // Group templates by category
        const categories = [...new Set(templates.map(t => t.category))];

        const getCategoryIcon = (category) => {
            if (category === "General") return <FileText className="w-5 h-5" />;
            if (category === "Freelancer / Solo Creator") return <Paintbrush className="w-5 h-5" />;
            if (category === "Agency / Growing Team") return <Briefcase className="w-5 h-5" />;
            if (category === "Contractor / Field Services") return <Wrench className="w-5 h-5" />;
            return <FileText className="w-5 h-5" />;
        };

        return (
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/quotes')} className="p-2 bg-white border border-gray-border rounded-lg hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-dark tracking-tight">Select a Template</h1>
                        <p className="text-muted-foreground mt-1">Choose a pre-built template to instantly generate a quote tailored to your business.</p>
                    </div>
                </div>

                {loadingTemplates ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {categories.map(category => (
                            <div key={category} className="space-y-4">
                                <div className="flex items-center space-x-2 border-b pb-2">
                                    <div className="p-1.5 bg-primary/10 text-primary rounded-md">
                                        {getCategoryIcon(category)}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {templates.filter(t => t.category === category).map(template => (
                                        <Card 
                                            key={template.id} 
                                            className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-md group"
                                            onClick={() => handleSelectTemplate(template)}
                                        >
                                            <CardHeader>
                                                <CardTitle className="group-hover:text-primary transition-colors">{template.name}</CardTitle>
                                                <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20">
                                                    {template.items.length} Pre-filled Items
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // --- QUOTE BUILDER VIEW ---
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={() => setIsTemplateSelected(false)} className="p-2 bg-white border border-gray-border rounded-lg hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-dark tracking-tight">Create Quote</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-border">
                    <h3 className="text-lg font-bold text-gray-dark mb-6 border-b pb-2">Client Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                            <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})}>
                                <option value="">Select a customer...</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quote Number</label>
                            <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                value={formData.quote_number} readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                                <option value="KSh">KSh (Kenyan Shilling)</option>
                                <option value="USD">USD (US Dollar)</option>
                                <option value="EUR">EUR (Euro)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-border">
                    <h3 className="text-lg font-bold text-gray-dark mb-6 border-b pb-2">Line Items</h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase">
                            <div className="col-span-6">Description</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Unit Price</div>
                            <div className="col-span-2 text-right">Amount</div>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-6">
                                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Item description"
                                        value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} />
                                </div>
                                <div className="col-span-2">
                                    <input type="number" min="1" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-center"
                                        value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))} />
                                </div>
                                <div className="col-span-2">
                                    <input type="number" min="0" step="0.01" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-right"
                                        value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} />
                                </div>
                                <div className="col-span-2 flex justify-between items-center text-right font-medium text-gray-dark pl-4">
                                    <span>{(item.quantity * item.unit_price).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    <button type="button" onClick={() => removeItem(index)} className="text-gray-400 hover:text-danger ml-2" disabled={items.length === 1}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addItem} className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-blue-700">
                        <Plus className="w-4 h-4 mr-1" /> Add Line Item
                    </button>

                    <div className="mt-10 border-t border-gray-border pt-6 flex justify-end">
                        <div className="w-72 space-y-3 text-right">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>{formData.currency} {subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>VAT (16%)</span>
                                <span>{formData.currency} {vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-dark pt-3 border-t">
                                <span>Total</span>
                                <span className="text-secondary">{formData.currency} {total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-border">
                    <h3 className="text-lg font-bold text-gray-dark mb-6 border-b pb-2">Additional Notes</h3>
                    <textarea rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Include any terms, conditions, or extra information for the client..."
                        value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                </div>

                <div className="flex justify-end pt-4 pb-12">
                    <button type="submit" className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold text-lg rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                        <Save className="w-5 h-5 mr-2" />
                        Save Quote
                    </button>
                </div>
            </form>
        </div>
    );
}

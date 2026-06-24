import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Save, Briefcase, Paintbrush, Wrench, FileText } from 'lucide-react';
import { CustomSelect } from '../components/ui/custom-select';
import { quoteTemplates } from '../lib/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function QuoteBuilder() {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [isTemplateSelected, setIsTemplateSelected] = useState(false);
    
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState("");
    
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
            if (error.response?.status === 403 && (error.response?.data?.detail || error.response?.data?.error)) {
                setUpgradeMessage(error.response.data.detail || error.response.data.error);
                setUpgradeModalOpen(true);
            } else {
                addToast("Failed to create quote. Please check your inputs and try again.", "error");
            }
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
                            <CustomSelect 
                                required 
                                value={formData.customer} 
                                onChange={(val) => setFormData({...formData, customer: val})}
                                options={customers.map(c => ({ label: c.name, value: c.id }))}
                                placeholder="Select a customer..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quote Number</label>
                            <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                value={formData.quote_number} readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <CustomSelect 
                                value={formData.currency} 
                                onChange={(val) => setFormData({...formData, currency: val})}
                                options={[
                                    { label: 'KSh (Kenyan Shilling)', value: 'KSh' },
                                    { label: 'USD (US Dollar)', value: 'USD' },
                                    { label: 'EUR (Euro)', value: 'EUR' }
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-border">
                    <h3 className="text-lg font-bold text-gray-dark mb-6 border-b pb-2">Line Items</h3>
                    
                    <div className="space-y-4">
                        <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase mb-2">
                            <div className="col-span-6">Description</div>
                            <div className="col-span-2 text-center">Quantity</div>
                            <div className="col-span-2 text-right">Unit Price</div>
                            <div className="col-span-2 text-right">Amount</div>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none relative">
                                <div className="w-full md:col-span-6">
                                    <label className="md:hidden block text-xs font-medium text-gray-500 uppercase mb-1">Description</label>
                                    <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Item description"
                                        value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} />
                                </div>
                                <div className="w-full md:col-span-2">
                                    <label className="md:hidden block text-xs font-medium text-gray-500 uppercase mb-1">Quantity</label>
                                    <input type="number" min="1" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary md:text-center"
                                        value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))} />
                                </div>
                                <div className="w-full md:col-span-2">
                                    <label className="md:hidden block text-xs font-medium text-gray-500 uppercase mb-1">Unit Price</label>
                                    <input type="number" min="0" step="0.01" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary md:text-right"
                                        value={item.unit_price} onChange={e => handleItemChange(index, 'unit_price', parseFloat(e.target.value))} />
                                </div>
                                <div className="w-full md:col-span-2 flex justify-between md:justify-end items-center text-right font-medium text-gray-dark md:pl-4 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                                    <div>
                                        <span className="md:hidden text-xs font-medium text-gray-500 uppercase mr-2">Amount:</span>
                                        <span>{(item.quantity * item.unit_price).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                    </div>
                                    <button type="button" onClick={() => removeItem(index)} className="text-gray-400 hover:text-danger ml-4" disabled={items.length === 1}>
                                        <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addItem} className="mt-6 inline-flex items-center text-sm font-semibold text-primary hover:text-blue-700">
                        <Plus className="w-4 h-4 mr-1" /> Add Line Item
                    </button>

                    <div className="mt-10 border-t border-gray-border pt-6 flex flex-col md:flex-row justify-end">
                        <div className="w-full md:w-72 space-y-3 text-right">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>{formData.currency} {subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>VAT (16%)</span>
                                <span>{formData.currency} {vat.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-dark border-t pt-3 mt-3">
                                <span>Total</span>
                                <span className="text-primary">{formData.currency} {total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="mt-10 border-t border-gray-border pt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Terms (Optional)</label>
                        <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-y min-h-[100px]"
                            placeholder="Add any specific terms, conditions or notes for the customer..."
                            value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-border">
                    <button type="button" onClick={() => navigate('/quotes')} className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1">
                        Cancel
                    </button>
                    <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm order-1 sm:order-2">
                        <Save className="w-4 h-4 mr-2" />
                        Save Quote
                    </button>
                </div>
            </form>

            {upgradeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-dark">Upgrade Required</h2>
                            <p className="text-gray-500 leading-relaxed">
                                {upgradeMessage}
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={() => setUpgradeModalOpen(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button"
                                onClick={() => navigate('/settings?tab=subscription')}
                                className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                            >
                                View Plans
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

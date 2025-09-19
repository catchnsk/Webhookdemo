import React, { useState, useEffect } from 'react';
import { WebhookSubscription } from '../../types/webhook';
import { WebhookApi } from '../../services/webhookApi';
import { Plus, Edit, Trash2, Power, Copy } from 'lucide-react';

const WebhookConsumer: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<WebhookSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<WebhookSubscription | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [''],
    secret: ''
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await WebhookApi.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const subscriptionData = {
        ...formData,
        events: formData.events.filter(e => e.trim()).filter(Boolean),
        isActive: true
      };

      if (subscriptionData.events.length === 0) {
        throw new Error('At least one event is required');
      }

      if (editingSubscription) {
        await WebhookApi.updateSubscription(editingSubscription.id, subscriptionData);
      } else {
        await WebhookApi.createSubscription(subscriptionData);
      }

      resetForm();
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save subscription'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', url: '', events: [''], secret: '' });
    setShowForm(false);
    setEditingSubscription(null);
  };

  const handleEdit = (subscription: WebhookSubscription) => {
    setEditingSubscription(subscription);
    setFormData({
      name: subscription.name,
      url: subscription.url,
      events: Array.isArray(subscription.events) ? subscription.events : Array.from(subscription.events),
      secret: subscription.secret
    });
    setShowForm(true);
  };

  const handleToggleActive = async (subscription: WebhookSubscription) => {
    try {
      await WebhookApi.updateSubscription(subscription.id, { 
        isActive: !subscription.isActive 
      });
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await WebhookApi.deleteSubscription(id);
        await fetchSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const addEventField = () => {
    setFormData(prev => ({ ...prev, events: [...prev.events, ''] }));
  };

  const updateEventField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map((event, i) => i === index ? value : event)
    }));
  };

  const removeEventField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };

  const generateSecret = () => {
    const secret = 'webhook_' + Math.random().toString(36).substr(2, 16);
    setFormData(prev => ({ ...prev, secret }));
  };

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Webhook Consumer</h2>
            <p className="text-gray-600">Manage webhook subscriptions and endpoints</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Subscription
          </button>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {subscription.name}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(subscription)}
                  className={`p-1 rounded ${
                    subscription.isActive 
                      ? 'text-green-600 hover:bg-green-100' 
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <Power className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEdit(subscription)}
                  className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(subscription.id)}
                  className="text-red-600 hover:bg-red-100 p-1 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
                <p className="text-sm text-gray-900 break-all">{subscription.url}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Events</label>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(subscription.events) ? subscription.events : Array.from(subscription.events)).map((event, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      {event}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Secret</label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                    {subscription.secret}
                  </code>
                  <button
                    onClick={() => copySecret(subscription.secret)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  subscription.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(subscription.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
                  {formData.events.map((event, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={event}
                        onChange={(e) => updateEventField(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., user.created"
                      />
                      {formData.events.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEventField(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEventField}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Event
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secret</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.secret}
                      onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateSecret}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingSubscription ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookConsumer;
import React, { useState, useEffect } from 'react';
import { WebhookStats } from '../../types/webhook';
import { WebhookApi } from '../../services/webhookApi';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await WebhookApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  if (loading || !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const successRate = stats.totalEvents > 0 
    ? Math.round((stats.successfulEvents / stats.totalEvents) * 100) 
    : 0;

  const chartData = [
    { name: 'Success', value: stats.eventsByStatus.success, color: '#10B981' },
    { name: 'Failed', value: stats.eventsByStatus.failed, color: '#EF4444' },
    { name: 'Pending', value: stats.eventsByStatus.pending, color: '#F59E0B' },
    { name: 'Retrying', value: stats.eventsByStatus.retrying, color: '#3B82F6' }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Statistics & Analytics</h2>
            <p className="text-gray-600">Monitor webhook performance and trends</p>
          </div>
          <div className="flex gap-2">
            {[
              { value: '24h', label: 'Last 24 Hours' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              <p className="text-sm text-green-600 mt-1">↑ 12% from last period</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">{successRate}%</p>
              <p className="text-sm text-green-600 mt-1">↑ 3% from last period</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Failed Events</p>
              <p className="text-2xl font-bold text-red-600">{stats.failedEvents}</p>
              <p className="text-sm text-red-600 mt-1">↓ 5% from last period</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageResponseTime}ms</p>
              <p className="text-sm text-green-600 mt-1">↓ 8% from last period</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Event Status Distribution</h3>
          </div>
          
          <div className="space-y-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 flex-1 max-w-48">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-8">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Events</span>
              <span className="font-medium">{stats.totalEvents}</span>
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-800">Delivery Success</p>
                <p className="text-xs text-green-600">Webhooks delivered successfully</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-700">{successRate}%</p>
                <p className="text-xs text-green-600">↑ 3.2%</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-800">Response Time</p>
                <p className="text-xs text-blue-600">Average webhook response time</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-700">{stats.averageResponseTime}ms</p>
                <p className="text-xs text-green-600">↓ 8.1%</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-800">Retry Rate</p>
                <p className="text-xs text-purple-600">Events requiring retries</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-700">
                  {stats.totalEvents > 0 ? Math.round((stats.eventsByStatus.retrying / stats.totalEvents) * 100) : 0}%
                </p>
                <p className="text-xs text-red-600">↓ 1.5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Event Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentEvents.slice(0, 8).map((event) => (
              <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  {event.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : event.status === 'failed' ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-64">
                      {event.url}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleDateString()} at {new Date(event.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'success' ? 'bg-green-100 text-green-800' :
                    event.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                  {event.responseTime && (
                    <span className="text-xs text-gray-500">{event.responseTime}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
import React, { useState, useEffect } from 'react';
import { WebhookStats } from '../../types/webhook';
import { WebhookApi } from '../../services/webhookApi';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';

const Overview: React.FC = () => {
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const data = await WebhookApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Unable to connect to the backend server. Please ensure the Spring Boot application is running.');
        // Set fallback stats when backend is unavailable
        setStats({
          totalEvents: 0,
          successfulEvents: 0,
          failedEvents: 0,
          averageResponseTime: 0,
          eventsByStatus: {
            pending: 0,
            success: 0,
            failed: 0,
            retrying: 0
          },
          recentEvents: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Connection Error</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Activity,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Successful',
      value: stats.successfulEvents,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Failed',
      value: stats.failedEvents,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.averageResponseTime}ms`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6">
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <h3 className="text-yellow-800 font-medium">Backend Unavailable</h3>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Showing cached data. {error}
          </p>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            error ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            <Zap className={`h-4 w-4 ${error ? 'text-red-600' : 'text-yellow-600'}`} />
            <span className={`text-xs font-medium ${
              error ? 'text-red-800' : 'text-yellow-800'
            }`}>
              {error ? 'Offline Mode' : 'Kafka Enabled'}
            </span>
          </div>
        </div>
        <p className="text-gray-600">
          {error 
            ? 'Dashboard is in offline mode. Start the backend server to see live data.'
            : 'Monitor your webhook activity and performance with real-time Kafka processing'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Status Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(stats.eventsByStatus).map(([status, count]) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'success': return 'bg-green-500';
                  case 'failed': return 'bg-red-500';
                  case 'pending': return 'bg-yellow-500';
                  case 'retrying': return 'bg-blue-500';
                  default: return 'bg-gray-500';
                }
              };

              const percentage = stats.totalEvents > 0 ? (count / stats.totalEvents) * 100 : 0;

              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-3">
            {stats.recentEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {event.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : event.status === 'failed' ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                      {event.url}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleDateString()} {new Date(event.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'success' ? 'bg-green-100 text-green-800' :
                  event.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
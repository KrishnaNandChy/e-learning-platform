'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageSquare, Search, Plus, Clock, CheckCircle, AlertCircle,
  ChevronRight, Eye, ThumbsUp
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Avatar } from '@/components/ui';
import { doubtAPI } from '@/lib/api';
import { Doubt } from '@/types';

export default function MyDoubtsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const params: any = {};
        if (filter !== 'all') params.status = filter;
        
        const response = await doubtAPI.getAll(params);
        setDoubts(response.data.data?.doubts || []);
      } catch (error) {
        console.error('Error fetching doubts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, [filter]);

  const filteredDoubts = doubts.filter((doubt) =>
    doubt.title.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    all: doubts.length,
    open: doubts.filter((d) => d.status === 'open').length,
    answered: doubts.filter((d) => d.status === 'answered').length,
    closed: doubts.filter((d) => d.status === 'closed').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      open: { variant: 'error', icon: AlertCircle, label: 'Open' },
      answered: { variant: 'warning', icon: Clock, label: 'Answered' },
      closed: { variant: 'success', icon: CheckCircle, label: 'Closed' },
      flagged: { variant: 'error', icon: AlertCircle, label: 'Flagged' },
    };
    const config = variants[status] || variants.open;
    return (
      <Badge variant={config.variant}>
        <config.icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Doubts</h1>
          <p className="text-gray-600 mt-1">Track and manage your questions</p>
        </div>
        <Link href="/dashboard/doubts/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Ask a Question
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doubts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'open', label: 'Open' },
            { key: 'answered', label: 'Answered' },
            { key: 'closed', label: 'Closed' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === item.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label} ({stats[item.key as keyof typeof stats]})
            </button>
          ))}
        </div>
      </div>

      {/* Doubts List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDoubts.length > 0 ? (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <motion.div
              key={doubt._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href={`/dashboard/doubts/${doubt._id}`}>
                <Card hover className="transition-all hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(doubt.status)}
                          {doubt.isResolved && (
                            <Badge variant="info" size="sm">Accepted Answer</Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {doubt.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {doubt.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {doubt.replies?.length || 0} replies
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {doubt.upvotes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {doubt.views || 0} views
                          </span>
                          <span className="text-gray-400">
                            {new Date(doubt.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm text-gray-500">Course</p>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {doubt.course?.title}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {search || filter !== 'all' ? 'No doubts found' : 'No doubts yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {search || filter !== 'all'
                ? 'Try adjusting your filters'
                : 'Have a question? Ask your instructors!'}
            </p>
            {!search && filter === 'all' && (
              <Link href="/dashboard/doubts/new">
                <Button>Ask Your First Question</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

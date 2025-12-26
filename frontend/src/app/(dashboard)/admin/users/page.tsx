'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, MoreVertical, UserPlus, Mail, Calendar,
  Shield, CheckCircle, XCircle, Ban, Eye, Edit, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Badge, Card, CardContent, Avatar, Modal, Input } from '@/components/ui';
import { adminAPI } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionModal, setActionModal] = useState<{ open: boolean; action: string; user: User | null }>({
    open: false,
    action: '',
    user: null,
  });

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, search]);

  const fetchUsers = async () => {
    try {
      const params: any = {
        page,
        limit: 20,
      };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;

      const response = await adminAPI.getUsers(params);
      setUsers(response.data.data?.users || []);
      setTotalPages(response.data.data?.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!actionModal.user) return;

    try {
      switch (actionModal.action) {
        case 'activate':
          await adminAPI.updateUserStatus(actionModal.user._id, { isActive: true });
          toast.success('User activated successfully');
          break;
        case 'deactivate':
          await adminAPI.updateUserStatus(actionModal.user._id, { isActive: false });
          toast.success('User deactivated successfully');
          break;
        case 'delete':
          await adminAPI.deleteUser(actionModal.user._id);
          toast.success('User deleted successfully');
          break;
      }
      fetchUsers();
      setActionModal({ open: false, action: '', user: null });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, any> = {
      admin: { variant: 'error', label: 'Admin' },
      admin_helper: { variant: 'warning', label: 'Admin Helper' },
      instructor: { variant: 'primary', label: 'Instructor' },
      student: { variant: 'default', label: 'Student' },
    };
    const config = variants[role] || variants.student;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform users</p>
        </div>
        <Button leftIcon={<UserPlus className="w-4 h-4" />}>
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All Users' },
            { key: 'student', label: 'Students' },
            { key: 'instructor', label: 'Instructors' },
            { key: 'admin', label: 'Admins' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setRoleFilter(item.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                roleFilter === item.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="animate-pulse flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32" />
                          <div className="h-3 bg-gray-200 rounded w-48" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 bg-gray-200 rounded w-20 ml-auto animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="error" size="sm">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                        {user.isEmailVerified && (
                          <Badge variant="info" size="sm">Verified</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {user.isActive ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActionModal({ open: true, action: 'deactivate', user })}
                          >
                            <Ban className="w-4 h-4 text-orange-500" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActionModal({ open: true, action: 'activate', user })}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActionModal({ open: true, action: 'delete', user })}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center py-4 border-t border-gray-200">
            <nav className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </Card>

      {/* Action Confirmation Modal */}
      <Modal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, action: '', user: null })}
        title={
          actionModal.action === 'delete'
            ? 'Delete User'
            : actionModal.action === 'deactivate'
            ? 'Deactivate User'
            : 'Activate User'
        }
      >
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {actionModal.action === 'delete'
              ? `Are you sure you want to delete "${actionModal.user?.name}"? This action cannot be undone.`
              : actionModal.action === 'deactivate'
              ? `Are you sure you want to deactivate "${actionModal.user?.name}"? They will not be able to access their account.`
              : `Are you sure you want to activate "${actionModal.user?.name}"? They will be able to access their account.`}
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setActionModal({ open: false, action: '', user: null })}
            >
              Cancel
            </Button>
            <Button
              variant={actionModal.action === 'delete' ? 'danger' : 'primary'}
              onClick={handleAction}
            >
              {actionModal.action === 'delete'
                ? 'Delete'
                : actionModal.action === 'deactivate'
                ? 'Deactivate'
                : 'Activate'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

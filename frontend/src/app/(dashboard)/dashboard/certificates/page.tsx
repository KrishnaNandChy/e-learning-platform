'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Download, Eye, Calendar, Share2, ExternalLink, Search } from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { certificateAPI } from '@/lib/api';
import { Certificate } from '@/types';

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificateAPI.getMy({});
        setCertificates(response.data.data?.certificates || []);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const filteredCertificates = certificates.filter((cert) =>
    cert.courseName.toLowerCase().includes(search.toLowerCase())
  );

  const handleShare = async (certificate: Certificate) => {
    const shareUrl = certificate.verificationUrl || `${window.location.origin}/certificates/verify/${certificate.certificateId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate: ${certificate.courseName}`,
          text: `Check out my certificate for ${certificate.courseName}!`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-1">View and download your earned certificates</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search certificates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="w-full h-40 bg-gray-200 rounded-lg" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCertificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <motion.div
              key={certificate._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card hover className="overflow-hidden">
                {/* Certificate Preview */}
                <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 p-6 text-white">
                  <div className="absolute top-4 right-4">
                    <Award className="w-8 h-8 opacity-20" />
                  </div>
                  <div className="text-center py-4">
                    <Award className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="font-bold text-lg">Certificate of Completion</h3>
                    <p className="text-sm text-white/80 mt-1">{certificate.courseName}</p>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{certificate.courseName}</h3>
                      <p className="text-sm text-gray-500">by {certificate.instructorName}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Issued {new Date(certificate.issueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="success">
                        {certificate.isValid ? 'Valid' : 'Revoked'}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        ID: {certificate.certificateId}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <a
                        href={certificate.file?.url || '#'}
                        download
                        className="flex-1"
                      >
                        <Button variant="primary" fullWidth size="sm" leftIcon={<Download className="w-4 h-4" />}>
                          Download
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(certificate)}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Link href={`/certificates/verify/${certificate.certificateId}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              {search ? 'No certificates found' : 'No certificates yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {search
                ? 'Try adjusting your search'
                : 'Complete courses to earn certificates'}
            </p>
            {!search && (
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

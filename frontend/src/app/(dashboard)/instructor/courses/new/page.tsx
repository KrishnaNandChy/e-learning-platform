'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Save, Upload, Plus, X, Check,
  BookOpen, DollarSign, Target, Users, Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Card, CardContent, Badge } from '@/components/ui';
import { courseAPI, categoryAPI } from '@/lib/api';
import { Category } from '@/types';

interface CourseFormData {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  price: number;
  isFree: boolean;
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  tags: string[];
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  // Array fields
  const [learnItems, setLearnItems] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [audience, setAudience] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    defaultValues: {
      level: 'beginner',
      isFree: false,
      price: 0,
    },
  });

  const isFree = watch('isFree');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll({ activeOnly: true });
        setCategories(response.data.data?.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const onSubmit = async (data: CourseFormData) => {
    setLoading(true);
    try {
      const formData = {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        category: data.category,
        level: data.level,
        pricing: {
          price: data.isFree ? 0 : data.price,
          isFree: data.isFree,
        },
        whatYouWillLearn: learnItems.filter(Boolean),
        requirements: requirements.filter(Boolean),
        targetAudience: audience.filter(Boolean),
        tags: tags,
      };

      const response = await courseAPI.create(formData);
      const courseId = response.data.data._id;

      // Upload thumbnail if provided
      if (thumbnail) {
        const thumbFormData = new FormData();
        thumbFormData.append('thumbnail', thumbnail);
        await courseAPI.uploadThumbnail(courseId, thumbFormData);
      }

      toast.success('Course created successfully!');
      router.push(`/instructor/courses/${courseId}/edit`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Content' },
    { number: 3, title: 'Pricing' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-1">Fill in the details to create your course</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <React.Fragment key={s.number}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                    step >= s.number
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                </div>
                <span
                  className={`hidden sm:block font-medium ${
                    step >= s.number ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    step > s.number ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  Course Information
                </h2>

                <Input
                  label="Course Title"
                  placeholder="e.g., Complete Web Development Bootcamp"
                  error={errors.title?.message}
                  {...register('title', { required: 'Title is required' })}
                />

                <Input
                  label="Course Subtitle"
                  placeholder="A brief tagline for your course"
                  error={errors.subtitle?.message}
                  {...register('subtitle')}
                />

                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows={5}
                    placeholder="Describe what students will learn..."
                    className="input"
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="error-text">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category</label>
                    <select
                      className="input"
                      {...register('category', { required: 'Category is required' })}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="error-text">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Level</label>
                    <select className="input" {...register('level')}>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all_levels">All Levels</option>
                    </select>
                  </div>
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="label">Course Thumbnail</label>
                  <div className="flex items-start gap-4">
                    <div className="w-48 h-28 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        id="thumbnail"
                      />
                      <label htmlFor="thumbnail" className="cursor-pointer">
                        <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all duration-200">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: 1280x720px (16:9)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Content */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  Course Content
                </h2>

                {/* What you'll learn */}
                <div>
                  <label className="label">What will students learn?</label>
                  <p className="text-sm text-gray-500 mb-3">
                    Add at least 4 learning outcomes
                  </p>
                  {learnItems.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem(setLearnItems, index, e.target.value)}
                        placeholder="Students will learn..."
                        className="input flex-1"
                      />
                      {learnItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem(setLearnItems, index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem(setLearnItems)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Item
                  </Button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="label">Requirements</label>
                  <p className="text-sm text-gray-500 mb-3">
                    What do students need before taking this course?
                  </p>
                  {requirements.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem(setRequirements, index, e.target.value)}
                        placeholder="Requirement..."
                        className="input flex-1"
                      />
                      {requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem(setRequirements, index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem(setRequirements)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Requirement
                  </Button>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="label">Target Audience</label>
                  <p className="text-sm text-gray-500 mb-3">
                    Who is this course for?
                  </p>
                  {audience.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem(setAudience, index, e.target.value)}
                        placeholder="This course is for..."
                        className="input flex-1"
                      />
                      {audience.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem(setAudience, index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem(setAudience)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Add Audience
                  </Button>
                </div>

                {/* Tags */}
                <div>
                  <label className="label">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Add a tag..."
                      className="input flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="primary" className="px-3 py-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Pricing */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  Pricing
                </h2>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setValue('isFree', e.target.checked)}
                      className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-medium">This is a free course</span>
                  </label>
                </div>

                {!isFree && (
                  <div>
                    <Input
                      label="Course Price (₹)"
                      type="number"
                      placeholder="Enter price"
                      min={0}
                      error={errors.price?.message}
                      {...register('price', {
                        required: !isFree ? 'Price is required' : false,
                        min: { value: 0, message: 'Price must be positive' },
                      })}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Platform commission: 20%. You will receive: ₹{((watch('price') || 0) * 0.8).toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              type="submit"
              isLoading={loading}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Create Course
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

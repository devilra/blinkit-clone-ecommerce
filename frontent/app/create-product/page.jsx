"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FiX } from "react-icons/fi";
import { createProduct, resetSuccess } from "../redux/slices/productSlice";
import { toast } from "react-toastify";

const AdminProductCreate = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    unit: "",
  });
  const [image, setImage] = useState(null);
  const [gallery, setGallery] = useState([]);

  // console.log(form);
  // console.log(image);
  // console.log(gallery);

  // Refs for hidden file inputs
  const mainImageRef = useRef(null);
  const galleryRef = useRef(null);

  const { items: categories } = useSelector((state) => state.categories);
  const { loading, error, success } = useSelector((state) => state.products);
  console.log(categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  const removeMainImage = () => setImage(null);
  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);
    if (gallery.length > 0)
      gallery.forEach((file) => formData.append("gallery", file));

    try {
      const resultAction = await dispatch(createProduct(formData));
      if (createProduct.fulfilled.match(resultAction)) {
        toast.success("Product created");

        // Reset form and images
        setForm({
          name: "",
          description: "",
          category: "",
          price: "",
          stock: "",
          unit: "",
        });
        setImage(null);
        setGallery([]);
        dispatch(resetSuccess());
      } else {
        toast.error(resultAction.payload || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Error creating product");
    }
  };

  return (
    <div className="p-6 bg-white md:mb-20 dark:bg-gray-900 max-w-3xl mx-auto rounded-xl md:mt-36 shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="name" className="py-1">
            Product Name
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>
        {/* Description */}
        <div className="space-y-1">
          <Label htmlFor="description" className="py-1">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="category" className="py-1">
            Category
          </Label>
          <Select
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, category: val }))
            }
            value={form.category}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="-- Select Category --" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Price */}
        <div className="space-y-1">
          <Label htmlFor="price">Price</Label>
          <Input
            type="number"
            id="price"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
          />
        </div>
        {/* Stock */}
        <div className="space-y-1">
          <Label htmlFor="stock">Stock</Label>
          <Input
            type="number"
            id="stock"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Enter stock"
          />
        </div>
        {/* Unit */}
        <div className="space-y-1">
          <Label htmlFor="unit">Unit</Label>
          <Input
            type="text"
            id="unit"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="kg, pcs, etc"
          />
        </div>

        {/* Main Image */}
        <div className="space-y-2 relative">
          <Label className="py-1">Main Image</Label>
          <Button
            type="button"
            variant="outline"
            onClick={() => mainImageRef.current.click()}
          >
            {image ? "Change Image" : "Upload Main Image"}
          </Button>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            ref={mainImageRef}
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && (
            <div className="relative mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="h-20 w-20 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={removeMainImage}
                className="absolute -top-2 left-15 cursor-pointer bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Gallery Images */}

        <div className="space-y-2">
          <Label className="py-1">Gallery Images (max 5)</Label>
          <Button
            type="button"
            variant="outline"
            onClick={() => galleryRef.current.click()}
          >
            {gallery.length > 0 ? "Change Gallery" : "Upload Gallery Images"}
          </Button>
          <Input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={galleryRef}
            onChange={(e) => {
              const newFiles = Array.from(e.target.files);
              setGallery((prev) => {
                const combined = [...prev, ...newFiles];
                return combined.slice(0, 5); // max 5
              });
            }}
          />

          {gallery.length > 0 && (
            <div className="flex gap-3 mt-2 flex-wrap">
              {gallery.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${idx}`}
                    className="h-16 w-16 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Create Product"}
        </Button>
      </form>
    </div>
  );
};

export default AdminProductCreate;

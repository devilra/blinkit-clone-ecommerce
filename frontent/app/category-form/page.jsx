"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../redux/slices/categorySlice";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const CategoryForm = () => {
  const dispatch = useDispatch();
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const { items, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  useEffect(() => {
    if (editId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editId) {
        await dispatch(
          updateCategory({ id: editId, updates: formData })
        ).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await dispatch(createCategory(formData));
        toast.success("Category created successfully!");
      }
      setFormData({ name: "", status: "active" });
      setEditId(null);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat) => {
    setFormData({ name: cat.name, status: cat.status });
    setEditId(cat._id);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-36 bg-gradient-to-t from-amber-50">
      <Card>
        <CardHeader>
          <CardTitle>Admin: Manage Categories</CardTitle>
          <CardDescription>
            Create, update, or delete categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 sm:items-center"
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder="Category name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="flex-1"
            />

            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
              disabled={submitting}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving"
                : editId
                ? "Update Category"
                : "Add Category"}{" "}
            </Button> */}

            {editId ? (
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving" : "Update Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditId(null)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving" : "Add Category"}
              </Button>
            )}
          </form>

          {/* Category List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              All Categories
            </h3>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {items.map((cat) => (
                  <Card
                    key={cat._id}
                    className="flex flex-col justify-between p-3"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{cat.name}</p>
                      <span
                        className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                          cat.status === "active"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {cat.status}
                      </span>
                    </div>
                    <CardFooter className="flex justify-end gap-2 p-0 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(cat)}
                        className="cursor-pointer"
                        disabled={submitting}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {/* Delete with AlertDialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            disabled={submitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. It will permanently
                              delete <b>{cat.name}</b>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cat._id)}
                            >
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;

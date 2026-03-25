// import React, { useState, useEffect } from "react";
// import { FaImage } from "react-icons/fa";
// import api from "../../../api/axios";
// import type { Menu, MenuFormData } from "../../types";

// interface MenuFormProps {
//   menu?: Menu | null;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface Category {
//   id?: number;
//   name: string;
// }

// const MenuForm: React.FC<MenuFormProps> = ({ menu, onClose, onSuccess }) => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);
//   const [newCategory, setNewCategory] = useState("");
//   const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

//   const [formData, setFormData] = useState<MenuFormData>({
//     name: menu?.name || "",
//     description: menu?.description || "",
//     price: menu?.price || 0,
//     category: menu?.category || "",
//     stock: menu?.stock || 0,
//     image: null,
//     is_available: menu?.is_available ?? true,
//   });

//   const [imagePreview, setImagePreview] = useState<string | null>(
//     menu?.image || null,
//   );
//   const [loading, setLoading] = useState(false);

//   // Fetch categories on mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoadingCategories(true);
//       const response = await api.get("/admin/categories");

//       // Handle berbagai format response
//       let cats: Category[] = [];
//       const data = response.data.data || response.data;

//       if (Array.isArray(data)) {
//         if (data.length > 0 && typeof data[0] === "string") {
//           // Jika array of strings
//           cats = data.map((cat, index) => ({ id: index, name: cat }));
//         } else if (data.length > 0 && typeof data[0] === "object") {
//           // Jika array of objects
//           cats = data.map((cat: any) => ({
//             id: cat.id || cat.category_id,
//             name: cat.name || cat.category,
//           }));
//         }
//       }

//       setCategories(cats);
//     } catch (error) {
//       console.error("Failed to fetch categories:", error);
//       // Fallback categories
//       setCategories([
//         { id: 1, name: "Coffee" },
//         { id: 2, name: "Tea" },
//         { id: 3, name: "Pastry" },
//         { id: 4, name: "Snacks" },
//         { id: 5, name: "Beverages" },
//       ]);
//     } finally {
//       setLoadingCategories(false);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" ? Number(value) : value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setFormData((prev) => ({ ...prev, image: file }));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleAddNewCategory = () => {
//     if (newCategory.trim()) {
//       const newCat = {
//         id: Date.now(),
//         name: newCategory.trim(),
//       };
//       setCategories((prev) => [...prev, newCat]);
//       setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
//       setNewCategory("");
//       setShowNewCategoryInput(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formDataToSend = new FormData();

//       // Mapping data sesuai backend
//       const fields = [
//         { name: "name", value: formData.name },
//         { name: "description", value: formData.description },
//         { name: "price", value: String(formData.price) },
//         { name: "category", value: formData.category },
//         { name: "stock", value: String(Math.floor(formData.stock)) },
//         { name: "is_available", value: formData.is_available ? "1" : "0" },
//       ];

//       // Append semua field text
//       fields.forEach((field) => {
//         if (
//           field.value !== null &&
//           field.value !== undefined &&
//           field.value !== ""
//         ) {
//           formDataToSend.append(field.name, field.value);
//         }
//       });

//       // Append image jika ada
//       if (formData.image instanceof File) {
//         formDataToSend.append("image", formData.image);
//       }

//       // Log untuk debugging
//       console.log("📤 Sending FormData:");
//       for (let pair of formDataToSend.entries()) {
//         console.log(`  ${pair[0]}:`, pair[1]);
//       }

//       const response = await api.post(
//         menu ? `/admin/menus/${menu.id}` : "/admin/menus",
//         formDataToSend,
//         { headers: { "Content-Type": "multipart/form-data" } },
//       );

//       console.log("✅ Success:", response.data);
//       onSuccess();
//     } catch (error: any) {
//       console.error("❌ Error:", error);

//       if (error.response?.status === 422) {
//         const errors = error.response.data.errors || {};
//         const errorMessages = Object.values(errors).flat().join("\n");
//         alert(`Validation Error:\n${errorMessages}`);
//       } else {
//         alert(
//           error.response?.data?.message ||
//             error.message ||
//             "Failed to save menu",
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {menu ? "Edit Menu" : "Add New Menu"}
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Menu Image
//             </label>
//             <div className="flex items-center gap-4">
//               <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
//                 {imagePreview ? (
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <FaImage className="w-8 h-8 text-gray-400" />
//                 )}
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
//               />
//             </div>
//           </div>

//           {/* Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="e.g., Espresso, Cappuccino"
//               className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={3}
//               placeholder="Describe your menu item..."
//               className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
//             />
//           </div>

//           {/* Price and Category */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price * (Rp)
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//                 min="0"
//                 step="1000"
//                 placeholder="25000"
//                 className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category *
//               </label>

//               {!showNewCategoryInput ? (
//                 <div className="flex gap-2">
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     required
//                     className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 bg-white">
//                     <option value="" disabled>
//                       Select a category
//                     </option>
//                     {loadingCategories ? (
//                       <option value="" disabled>
//                         Loading categories...
//                       </option>
//                     ) : (
//                       categories.map((cat) => (
//                         <option key={cat.id || cat.name} value={cat.name}>
//                           {cat.name}
//                         </option>
//                       ))
//                     )}
//                   </select>
//                   <button
//                     type="button"
//                     onClick={() => setShowNewCategoryInput(true)}
//                     className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
//                     title="Add new category">
//                     +
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     value={newCategory}
//                     onChange={(e) => setNewCategory(e.target.value)}
//                     placeholder="New category name"
//                     className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
//                     autoFocus
//                   />
//                   <button
//                     type="button"
//                     onClick={handleAddNewCategory}
//                     className="px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
//                     title="Add">
//                     ✓
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowNewCategoryInput(false);
//                       setNewCategory("");
//                     }}
//                     className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
//                     title="Cancel">
//                     ✗
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Stock */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Stock *
//             </label>
//             <input
//               type="number"
//               name="stock"
//               value={formData.stock}
//               onChange={handleChange}
//               required
//               min="0"
//               placeholder="0"
//               className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
//             />
//           </div>

//           {/* Availability */}
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               id="is_available"
//               name="is_available"
//               checked={formData.is_available}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   is_available: e.target.checked,
//                 }))
//               }
//               className="w-4 h-4 text-red-700 rounded border-gray-300 focus:ring-red-200"
//             />
//             <label
//               htmlFor="is_available"
//               className="text-sm font-medium text-gray-700">
//               Available for ordering
//             </label>
//           </div>

//           {/* Actions */}
//           <div className="flex gap-3 pt-4 border-t border-gray-100">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 bg-red-700 text-white rounded-xl font-medium hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24">
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   {menu ? "Updating..." : "Creating..."}
//                 </span>
//               ) : menu ? (
//                 "Update Menu"
//               ) : (
//                 "Create Menu"
//               )}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MenuForm;

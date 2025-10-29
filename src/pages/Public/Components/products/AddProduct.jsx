import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-js-loader";
import { useParams } from "react-router-dom";

// Constants for better maintainability
const MAX_DISCOUNT = 80;
const MIN_PRICE = 10;
const MAX_SIZES_PER_COLOR = 5;

// Initial form state
const initialFormData = {
  name: "",
  description: "",
  price: 0,
  isOnSale: false,
  discount: 0,
  inStock: true,
  soldOut: false,
  images: [],
  colors: [],
  collection: "",
  modelDetail: "",
  showToCustomer: false,
  gender: "",
  group: "",
  season: "",
  numberOfProducts: 0,
};

// Validation utilities
const isValidHexColor = (color) => /^#([A-Fa-f0-9]{6})$/.test(color);
const normalizeHexColor = (color) => color.startsWith("#") ? color : `#${color}`;

const AddProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [tempFiles, setTempFiles] = useState([]);
  const [color, setColor] = useState("#000000");
  const [colorSizes, setColorSizes] = useState({});
  const [colorError, setColorError] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentSizeInput, setCurrentSizeInput] = useState({
    color: null,
    size: "",
    quantity: 1
  });
  const [editingSizeInfo, setEditingSizeInfo] = useState(null);
  const [editingImage, setEditingImage] = useState(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Color validation handler
  const handleColorChange = useCallback((e) => {
    const newColor = e.target.value;
    setColor(newColor);

    if (!newColor) {
      setColorError("");
      return;
    }

    const normalizedColor = normalizeHexColor(newColor);
    
    if (!isValidHexColor(normalizedColor)) {
      setColorError("Please enter a valid hex color (e.g., #000000)");
    } else {
      setColorError("");
    }
  }, []);

  // File upload handler
  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    setTempFiles(files);
  }, []);

  // Add images with color association
  const handleAddImages = useCallback(() => {
    if (tempFiles.length === 0 || !color) {
      toast.error("Please select images and a color.");
      return;
    }

    const normalizedColor = normalizeHexColor(color);
    if (!isValidHexColor(normalizedColor)) {
      toast.error("Please enter a valid hex color code (e.g., #000000)");
      return;
    }

    const newImages = tempFiles.map((file) => ({
      file,
      color: normalizedColor,
      url: URL.createObjectURL(file),
    }));

    const newUrls = tempFiles.map((file) => URL.createObjectURL(file));

    setFormData(prevData => {
      const isNewColor = !prevData.colors.includes(normalizedColor);
      
      return {
        ...prevData,
        colors: isNewColor ? [...prevData.colors, normalizedColor] : prevData.colors,
        images: [...prevData.images, ...newImages],
      };
    });

    // Initialize sizes for new color
    if (!colorSizes[normalizedColor]) {
      setColorSizes(prev => ({
        ...prev,
        [normalizedColor]: [],
      }));
    }

    setPreviewUrls(prev => [...prev, ...newUrls]);
    setTempFiles([]);
    setColor("#000000");
  }, [tempFiles, color, colorSizes]);

  // Remove image and cleanup
  const handleRemoveImage = useCallback((indexToRemove, imageColor) => {
    setFormData(prevData => {
      const newImages = prevData.images.filter((_, index) => index !== indexToRemove);
      const remainingColorImages = newImages.filter(img => img.color === imageColor);
      
      // Remove color if no images left
      const shouldRemoveColor = remainingColorImages.length === 0;
      
      return {
        ...prevData,
        images: newImages,
        colors: shouldRemoveColor 
          ? prevData.colors.filter(c => c !== imageColor) 
          : prevData.colors,
      };
    });

    // Remove sizes if color is being removed
    if (colorSizes[imageColor]) {
      const imageCount = formData.images.filter(img => img.color === imageColor).length;
      if (imageCount <= 1) {
        setColorSizes(prev => {
          const newColorSizes = { ...prev };
          delete newColorSizes[imageColor];
          return newColorSizes;
        });
      }
    }
  }, [colorSizes, formData.images]);

  // Size management
  const handleSizeInputChange = useCallback((e, color, field) => {
    setCurrentSizeInput({
      ...currentSizeInput,
      color: color,
      [field]: field === 'quantity' ? parseInt(e.target.value) || 0 : e.target.value
    });
  }, [currentSizeInput]);

  const handleAddSize = useCallback((color) => {
    const { size, quantity } = currentSizeInput;

    if (!size?.trim()) {
      toast.error("Please enter a size");
      return;
    }

    setColorSizes((prev) => {
      const currentSizes = prev[color] || [];

      if (currentSizes.length >= MAX_SIZES_PER_COLOR) {
        toast.error(`Maximum ${MAX_SIZES_PER_COLOR} sizes allowed per color`);
        return prev;
      }

      const isDuplicate = currentSizes.some((s) => s.value === size.trim());
      if (isDuplicate) {
        toast.error("This size already exists");
        return prev;
      }

      const newSize = {
        id: uuidv4(),
        value: size.trim(),
        quantity: Math.max(1, quantity || 1)
      };

      return {
        ...prev,
        [color]: [...currentSizes, newSize],
      };
    });

    setCurrentSizeInput({
      color: null,
      size: "",
      quantity: 1
    });
  }, [currentSizeInput]);

  const handleRemoveSize = useCallback((color, sizeId) => {
    setColorSizes((prev) => ({
      ...prev,
      [color]: prev[color].filter((size) => size.id !== sizeId),
    }));
  }, []);

  const handleEditSize = useCallback((color, sizeObj) => {
    setEditingSizeInfo({
      color: color,
      sizeId: sizeObj.id,
      currentValue: sizeObj.value,
      currentQuantity: sizeObj.quantity
    });
  }, []);

  const handleUpdateSize = useCallback(() => {
    if (!editingSizeInfo) return;

    const { color, sizeId, currentValue, currentQuantity } = editingSizeInfo;

    if (!currentValue.trim()) {
      toast.error("Size cannot be empty");
      return;
    }

    if (currentQuantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setColorSizes((prev) => ({
      ...prev,
      [color]: prev[color].map((size) =>
        size.id === sizeId
          ? { ...size, value: currentValue.trim(), quantity: currentQuantity }
          : size
      ),
    }));

    setEditingSizeInfo(null);
  }, [editingSizeInfo]);

  // Group images by color for API response
  const groupImagesByColor = useCallback((images, sizes) => {
    const colorDataMap = {};

    // Group images by color
    images.forEach((image) => {
      const { color, url } = image;
      if (!colorDataMap[color]) {
        colorDataMap[color] = {
          color: color,
          images: [],
          sizes: [],
          totalQuantity: 0
        };
      }
      
      if (url) {
        colorDataMap[color].images.push(url);
      }
    });

    // Add sizes to each color group
    Object.entries(sizes).forEach(([color, sizesArray]) => {
      if (!colorDataMap[color]) {
        colorDataMap[color] = {
          color: color,
          images: [],
          sizes: [],
          totalQuantity: 0
        };
      }

      const sizeData = sizesArray.map((sizeObj) => ({
        size: sizeObj.value,
        stockCount: sizeObj.quantity
      }));

      colorDataMap[color].sizes = sizeData;
      colorDataMap[color].totalQuantity = sizesArray.reduce(
        (sum, sizeObj) => sum + sizeObj.quantity, 0
      );
    });

    return Object.values(colorDataMap);
  }, []);

  // Transform form data to match required API format
  const transformFormDataForAPI = useCallback((formData, colorGroups) => {
    return {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      collection: formData.collection,
      modelDetail: formData.modelDetail,
      isPublic: formData.showToCustomer,
      gender: formData.gender,
      collectionType: formData.group,
      onSale: formData.isOnSale,
      discountPercent: formData.isOnSale ? Number(formData.discount) : 0,
      inStock: formData.inStock,
      type: formData.season,
      variants: colorGroups.map(group => ({
        color: group.color,
        images: group.images,
        sizes: group.sizes
      }))
    };
  }, []);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.price <= MIN_PRICE) {
      toast.error(`Price should be greater than ${MIN_PRICE}`);
      return;
    }

    if (formData.discount > MAX_DISCOUNT) {
      toast.error(`Discount percentage cannot be more than ${MAX_DISCOUNT}%`);
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsLoading(true);
    
    try {
      const colorGroups = groupImagesByColor(formData.images, colorSizes);
      const apiData = transformFormDataForAPI(formData, colorGroups);

      console.log("Submitting product:", apiData);

      // TODO: Replace with actual API call
      // const response = id 
      //   ? await updateProduct(id, apiData)
      //   : await addProduct(apiData);
      
      // toast.success(`Product ${id ? "updated" : "added"} successfully`);

      // Reset form
      setFormData(initialFormData);
      setColorSizes({});
      setPreviewUrls([]);
      setCurrentSizeInput({ color: null, size: "", quantity: 1 });

    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(`Error ${id ? "updating" : "adding"} product`);
    } finally {
      setIsLoading(false);
    }
  };

  // Generic input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Image editing
  const handleEditImage = useCallback((image, imageColor) => {
    setEditingImage({
      originalImage: image,
      color: imageColor,
      editedUrl: image.url,
    });
  }, []);

  const handleReplaceImage = useCallback(() => {
    if (tempFiles.length === 0) {
      toast.error("Please select an image to replace the existing one.");
      return;
    }

    const newFile = tempFiles[0];
    const newUrl = URL.createObjectURL(newFile);

    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.map((img) =>
        img.url === editingImage.originalImage.url
          ? { ...img, file: newFile, url: newUrl, color: editingImage.color }
          : img
      ),
    }));

    setPreviewUrls((prevUrls) =>
      prevUrls.map((url) =>
        url === editingImage.originalImage.url ? newUrl : url
      )
    );

    URL.revokeObjectURL(editingImage.originalImage.url);
    setTempFiles([]);
    setEditingImage(null);
  }, [tempFiles, editingImage]);

  // Memoized grouped images for performance
  const groupedImages = useMemo(() => 
    formData.images.reduce((acc, curr) => {
      if (!acc[curr.color]) acc[curr.color] = [];
      acc[curr.color].push(curr);
      return acc;
    }, {}),
  [formData.images]);

  return (
    <div className="max-w-4xl mx-auto p-4 add-product mt-[35px]">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "Edit Product" : "Add Product"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form fields remain the same as your original */}
        {/* Name */}
        <div>
          <label className="block font-medium">Name*</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          />
        </div>

        {/* Model Detail */}
        <div>
          <label className="block font-medium">Model detail</label>
          <textarea
            name="modelDetail"
            placeholder="Enter model detail"
            value={formData.modelDetail}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price*</label>
          <input
            type="number"
            name="price"
            required
            min={MIN_PRICE + 1}
            placeholder="Enter product price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          />
        </div>

        {/* Sale & Discount */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-medium">Is On Sale</label>
            <input
              type="checkbox"
              name="isOnSale"
              checked={formData.isOnSale}
              onChange={handleInputChange}
              className="mt-2"
            />
          </div>

          {formData.isOnSale && (
            <div>
              <label className="block font-medium">Discount (%):*</label>
              <input
                type="number"
                name="discount"
                required
                min="0"
                max={MAX_DISCOUNT}
                value={formData.discount}
                onChange={handleInputChange}
                className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
              />
            </div>
          )}
        </div>

        {/* Season */}
        <div>
          <label className="block font-medium">Season</label>
          <select
            name="season"
            required
            value={formData.season}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          >
            <option value="">Select Season</option>
            <option value="winter">Winter</option>
            <option value="summer">Summer</option>
            <option value="spring">Spring</option>
            <option value="autumn">Autumn</option>
          </select>
        </div>

        {/* Collection */}
        <div>
          <label className="block font-medium">Collection* <small>(Shirts, Paints, Jackets, etc)</small></label>
          <input
            type="text"
            name="collection"
            required
            placeholder="Enter collection name"
            value={formData.collection}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-medium">Gender*</label>
          <select
            name="gender"
            required
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Group */}
        <div>
          <label className="block font-medium">Group*</label>
          <select
            name="group"
            required
            value={formData.group}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          >
            <option value="">Select Group</option>
            <option value="kids">Kids</option>
            <option value="adults">Adults</option>
          </select>
        </div>

        {/* Image Upload Section */}
        <div className="flex justify-center text-[30px]">
          <span>Select Images For Product</span>
        </div>
        
        <div>
          <label className="block font-medium">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          />
        </div>

        {/* Color Input */}
        <div className="space-y-2">
          <label className="block font-medium">Color (Hex code)</label>
          <input
            type="text"
            value={color}
            onChange={handleColorChange}
            placeholder="#000000"
            className="w-full py-4 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
          />
          {colorError && (
            <p className="text-red-500 text-sm mt-1">{colorError}</p>
          )}
          {isValidHexColor(normalizeHexColor(color)) && (
            <div
              className="w-8 h-8 rounded mt-2"
              style={{ backgroundColor: color, border: "1px solid #ccc" }}
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleAddImages}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
        >
          Add Images
        </button>

        {/* Color Variants Section */}
        <div>
          <h3 className="text-xl font-bold mt-6 mb-4">
            Product Variants by Color
          </h3>
          
          {Object.entries(groupedImages).map(([imageColor, images]) => (
            <ColorVariantSection
              key={imageColor}
              color={imageColor}
              images={images}
              sizes={colorSizes[imageColor] || []}
              currentSizeInput={currentSizeInput}
              editingSizeInfo={editingSizeInfo}
              onSizeInputChange={handleSizeInputChange}
              onAddSize={handleAddSize}
              onRemoveSize={handleRemoveSize}
              onEditSize={handleEditSize}
              onUpdateSize={handleUpdateSize}
              onCancelSizeEdit={() => setEditingSizeInfo(null)}
              onRemoveImage={handleRemoveImage}
              onEditImage={handleEditImage}
            />
          ))}
        </div>

        {/* Image Replacement Modal */}
        {editingImage && (
          <ImageReplacementModal
            editingImage={editingImage}
            tempFiles={tempFiles}
            onFileChange={handleFileUpload}
            onReplace={handleReplaceImage}
            onCancel={() => setEditingImage(null)}
          />
        )}

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full py-4 bg-[#D9D9D9] rounded-[10px] hover:bg-[#c7c5c5] transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader type="bubble-spin" bgColor="#000" size={30} />
            ) : (
              "Submit Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Extracted component for color variant section
const ColorVariantSection = ({
  color,
  images,
  sizes,
  currentSizeInput,
  editingSizeInfo,
  onSizeInputChange,
  onAddSize,
  onRemoveSize,
  onEditSize,
  onUpdateSize,
  onCancelSizeEdit,
  onRemoveImage,
  onEditImage,
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-2">
      <div
        className="w-6 h-6 rounded"
        style={{ backgroundColor: color, border: "1px solid #ccc" }}
      />
      <span className="font-medium">
        {color} ({images.length} images)
      </span>
    </div>

    {/* Size Management */}
    <div className="mb-4">
      <label className="block font-medium">Sizes for {color}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={currentSizeInput.color === color ? currentSizeInput.size : ""}
          onChange={(e) => onSizeInputChange(e, color, 'size')}
          placeholder="Enter size (e.g., S, M, L)"
          className="w-1/3 py-2 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
        />
        <input
          type="number"
          min="1"
          value={currentSizeInput.color === color ? currentSizeInput.quantity : 1}
          onChange={(e) => onSizeInputChange(e, color, 'quantity')}
          placeholder="Qty"
          className="w-1/4 py-2 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => onAddSize(color)}
          className="w-1/4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Size
        </button>
      </div>

      {/* Size display */}
      <div className="flex flex-wrap gap-2 mt-2">
        {sizes.map((sizeObj) => (
          <SizeChip
            key={sizeObj.id}
            sizeObj={sizeObj}
            color={color}
            editingSizeInfo={editingSizeInfo}
            onEdit={onEditSize}
            onUpdate={onUpdateSize}
            onCancel={onCancelSizeEdit}
            onRemove={onRemoveSize}
          />
        ))}
      </div>
    </div>

    {/* Images display */}
    <div className="flex flex-wrap gap-4">
      {images.map((image, index) => (
        <ImageThumbnail
          key={index}
          image={image}
          color={color}
          index={index}
          onEdit={onEditImage}
          onRemove={onRemoveImage}
        />
      ))}
    </div>
  </div>
);

// Extracted component for size chip
const SizeChip = ({
  sizeObj,
  color,
  editingSizeInfo,
  onEdit,
  onUpdate,
  onCancel,
  onRemove,
}) => {
  const isEditing = editingSizeInfo?.color === color && editingSizeInfo?.sizeId === sizeObj.id;

  return (
    <div className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded">
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editingSizeInfo.currentValue}
            onChange={(e) => onEdit(color, { ...sizeObj, value: e.target.value })}
            className="text-black px-1 mr-1 rounded"
          />
          <input
            type="number"
            min="1"
            value={editingSizeInfo.currentQuantity}
            onChange={(e) => onEdit(color, { ...sizeObj, quantity: parseInt(e.target.value) || 0 })}
            className="text-black px-1 mr-1 rounded w-12"
          />
          <button
            type="button"
            onClick={onUpdate}
            className="text-green-500 hover:text-green-300 mr-1"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-red-500 hover:text-red-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span>{sizeObj.value}</span>
          <span className="mx-1">(Qty: {sizeObj.quantity})</span>
          <button
            type="button"
            onClick={() => onEdit(color, sizeObj)}
            className="text-white hover:text-blue-300 mr-1"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => onRemove(color, sizeObj.id)}
            className="text-white hover:text-red-300"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

// Extracted component for image thumbnail
const ImageThumbnail = ({ image, color, index, onEdit, onRemove }) => (
  <div className="relative">
    <img
      src={image.url}
      alt={`${color} ${index + 1}`}
      className="w-24 h-24 object-cover rounded-lg"
      style={{ border: `2px solid ${color}` }}
    />
    <div className="absolute top-0 right-0 flex">
      <button
        onClick={() => onEdit(image, color)}
        type="button"
        className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 mr-1"
      >
        ✎
      </button>
      <button
        type="button"
        onClick={() => onRemove(index, color)}
        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
      >
        ×
      </button>
    </div>
  </div>
);

// Extracted component for image replacement modal
const ImageReplacementModal = ({ editingImage, tempFiles, onFileChange, onReplace, onCancel }) => {
  const selectedReplacementImage = tempFiles.length > 0 ? URL.createObjectURL(tempFiles[0]) : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Replace Image</h2>
        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <p className="text-center mb-2">Original Image</p>
            <img
              src={editingImage.editedUrl}
              alt="Original"
              className="max-w-full h-48 object-cover rounded"
            />
          </div>
          <div className="w-1/2">
            <p className="text-center mb-2">New Image</p>
            <img
              src={selectedReplacementImage || ""}
              alt="New"
              className={`max-w-full h-48 object-cover rounded ${!selectedReplacementImage ? "border-2 border-dashed border-gray-300" : ""}`}
            />
            {!selectedReplacementImage && (
              <p className="text-center text-gray-500 mt-2">No image selected</p>
            )}
          </div>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full py-2 pl-4 pr-7 custom-border rounded-lg outline-none bg-transparent mb-4"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onReplace}
            disabled={tempFiles.length === 0}
            className={`py-2 px-4 rounded ${tempFiles.length > 0
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Replace Image
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export { AddProduct };
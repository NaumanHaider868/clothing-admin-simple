import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-js-loader";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../../utlis/customAPI";
import { useQueryClient } from "@tanstack/react-query";

const MAX_DISCOUNT = 80;
const MIN_PRICE = 10;
const MAX_SIZES_PER_COLOR = 5;

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

const productAPI = {
  addProduct: async (productData) => {
    const response = await api.post("/product/create", productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await api.patch(`/product/edit/${id}`, productData);
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/product/fetch/${id}`);
    return response.data;
  },
};

const isValidHexColor = (color) => /^#([A-Fa-f0-9]{6})$/.test(color);
const normalizeHexColor = (color) =>
  color.startsWith("#") ? color : `#${color}`;

const transformAPIDataToFormData = (apiData) => {
  const images = [];
  const colors = [];
  const colorSizes = {};

  if (apiData.variants && Array.isArray(apiData.variants)) {
    apiData.variants.forEach((variant) => {
      const color = variant.color;
      if (!colors.includes(color)) {
        colors.push(color);
      }

      if (variant.images && Array.isArray(variant.images)) {
        variant.images.forEach((imageUrl) => {
          images.push({
            url: imageUrl,
            color: color,
            isExisting: true,
          });
        });
      }

      if (variant.sizes && Array.isArray(variant.sizes)) {
        colorSizes[color] = variant.sizes.map((size) => ({
          id: uuidv4(),
          value: size.size,
          quantity: size.stockCount,
        }));
      }
    });
  }

  const genderMap = {
    men: "male",
    women: "female",
    unisex: "unisex",
  };

  const groupMap = {
    kids: "kids",
    adults: "adults",
    boys: "kids",
    girls: "kids",
  };

  return {
    formData: {
      name: apiData.name || "",
      description: apiData.description || "",
      price: apiData.price || 0,
      isOnSale: apiData.onSale || false,
      discount: apiData.discountPercent || 0,
      inStock: apiData.inStock !== undefined ? apiData.inStock : true,
      soldOut: apiData.soldOut || false,
      images: images,
      colors: colors,
      collection: apiData.collection || "",
      modelDetail: apiData.modelDetail || "",
      showToCustomer: apiData.isPublic || false,
      gender: genderMap[apiData.gender] || apiData.gender || "",
      group: groupMap[apiData.collectionType] || apiData.collectionType || "",
      season: apiData.type || "",
      numberOfProducts: apiData.numberOfProducts || 0,
    },
    colorSizes: colorSizes,
  };
};

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const [tempFiles, setTempFiles] = useState([]);
  const [color, setColor] = useState("#000000");
  const [colorSizes, setColorSizes] = useState({});
  const [colorError, setColorError] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentSizeInput, setCurrentSizeInput] = useState({
    color: null,
    size: "",
    quantity: 1,
  });
  const [editingSizeInfo, setEditingSizeInfo] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [editingImageColor, setEditingImageColor] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsFetching(true);
        const product = await productAPI.getProduct(id);
        const {
          formData: transformedFormData,
          colorSizes: transformedColorSizes,
        } = transformAPIDataToFormData(product.data);

        setFormData(transformedFormData);
        setColorSizes(transformedColorSizes);

        const existingPreviewUrls = transformedFormData.images
          .filter((img) => img.url)
          .map((img) => img.url);
        setPreviewUrls(existingPreviewUrls);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previewUrls?.length > 0) {
        previewUrls.forEach((url) => {
          if (typeof url === "string" && url.startsWith("blob:")) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [previewUrls]);

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

  const handleFileUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    setTempFiles(files);

    if (files.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

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

    setFormData((prevData) => {
      const isNewColor = !prevData.colors.includes(normalizedColor);

      return {
        ...prevData,
        colors: isNewColor
          ? [...prevData.colors, normalizedColor]
          : prevData.colors,
        images: [...prevData.images, ...newImages],
      };
    });

    if (!colorSizes[normalizedColor]) {
      setColorSizes((prev) => ({
        ...prev,
        [normalizedColor]: [],
      }));
    }

    setPreviewUrls((prev) => [...prev, ...newUrls]);
    setTempFiles([]);
    setColor("#000000");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [tempFiles, color, colorSizes]);

  const handleRemoveImage = useCallback(
    (indexToRemove, imageColor) => {
      const imageToRemove = formData.images[indexToRemove];
      if (!imageToRemove) return;

      const imageUrl = imageToRemove.url || imageToRemove;
      if (typeof imageUrl === "string" && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      setFormData((prevData) => {
        const newImages = prevData.images.filter(
          (_, index) => index !== indexToRemove
        );
        const remainingColorImages = newImages.filter(
          (img) => img && img.color === imageColor
        );

        const shouldRemoveColor = remainingColorImages.length === 0;

        return {
          ...prevData,
          images: newImages,
          colors: shouldRemoveColor
            ? (prevData.colors || []).filter((c) => c !== imageColor)
            : prevData.colors,
        };
      });

      setPreviewUrls((prev) =>
        prev.filter(
          (url) => url !== (typeof imageUrl === "string" ? imageUrl : "")
        )
      );

      if (colorSizes && colorSizes[imageColor]) {
        const imageCount = formData.images.filter(
          (img) => img && img.color === imageColor
        ).length;
        if (imageCount <= 1) {
          setColorSizes((prev) => {
            const newColorSizes = { ...prev };
            delete newColorSizes[imageColor];
            return newColorSizes;
          });
        }
      }
    },
    [colorSizes, formData.images]
  );

  // NEW: Handle image color change
  const handleImageColorChange = useCallback((imageIndex, newColor) => {
    const normalizedColor = normalizeHexColor(newColor);

    if (!isValidHexColor(normalizedColor)) {
      toast.error("Please enter a valid hex color code (e.g., #000000)");
      return;
    }

    setFormData((prevData) => {
      const updatedImages = [...prevData.images];
      const imageToUpdate = updatedImages[imageIndex];

      if (!imageToUpdate) return prevData;

      // Update the image color
      updatedImages[imageIndex] = {
        ...imageToUpdate,
        color: normalizedColor,
      };

      // Get unique colors from updated images
      const updatedColors = [...new Set(updatedImages.map((img) => img.color))];

      return {
        ...prevData,
        images: updatedImages,
        colors: updatedColors,
      };
    });

    // Ensure colorSizes entry exists for the new color
    setColorSizes((prev) => {
      if (!prev[normalizedColor]) {
        return {
          ...prev,
          [normalizedColor]: [],
        };
      }
      return prev;
    });
  }, []);

  const handleSizeInputChange = useCallback(
    (e, color, field) => {
      setCurrentSizeInput({
        ...currentSizeInput,
        color: color,
        [field]:
          field === "quantity" ? parseInt(e.target.value) || 0 : e.target.value,
      });
    },
    [currentSizeInput]
  );

  const handleAddSize = useCallback(
    (color) => {
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
          quantity: Math.max(1, quantity || 1),
        };

        return {
          ...prev,
          [color]: [...currentSizes, newSize],
        };
      });

      setCurrentSizeInput({
        color: null,
        size: "",
        quantity: 1,
      });
    },
    [currentSizeInput]
  );

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
      currentQuantity: sizeObj.quantity,
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

  // NEW: Handle edit image color
  const handleEditImageColor = useCallback((image, imageColor, index) => {
    setEditingImageColor({
      imageIndex: index,
      currentColor: imageColor,
      image: image,
    });
  }, []);

  // NEW: Update image color
  const handleUpdateImageColor = useCallback(
    (newColor) => {
      if (!editingImageColor) return;

      const normalizedColor = normalizeHexColor(newColor);

      if (!isValidHexColor(normalizedColor)) {
        toast.error("Please enter a valid hex color code (e.g., #000000)");
        return;
      }

      handleImageColorChange(editingImageColor.imageIndex, normalizedColor);
      setEditingImageColor(null);
    },
    [editingImageColor, handleImageColorChange]
  );

  const groupImagesByColor = useCallback((images, sizes) => {
    const colorDataMap = {};

    images.forEach((image) => {
      const { color, url } = image;
      if (!colorDataMap[color]) {
        colorDataMap[color] = {
          color: color,
          images: [],
          sizes: [],
          totalQuantity: 0,
        };
      }

      if (url) {
        colorDataMap[color].images.push({ imageUrl: url });
      }
    });

    Object.entries(sizes).forEach(([color, sizesArray]) => {
      if (!colorDataMap[color]) {
        colorDataMap[color] = {
          color: color,
          images: [],
          sizes: [],
          totalQuantity: 0,
        };
      }

      const sizeData = sizesArray.map((sizeObj) => ({
        size: sizeObj.value,
        stockCount: sizeObj.quantity,
      }));

      colorDataMap[color].sizes = sizeData;
      colorDataMap[color].totalQuantity = sizesArray.reduce(
        (sum, sizeObj) => sum + sizeObj.quantity,
        0
      );
    });

    return Object.values(colorDataMap);
  }, []);

  const transformFormDataForAPI = useCallback((formData, colorGroups) => {
    const genderMap = {
      male: "men",
      female: "women",
      unisex: "unisex",
    };

    const groupMap = {
      kids: "boys",
      adults: "adults",
    };

    return {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      collection: formData.collection,
      modelDetail: formData.modelDetail,
      isPublic: formData.showToCustomer,
      gender: genderMap[formData.gender] || formData.gender,
      collectionType: groupMap[formData.group] || formData.group,
      onSale: formData.isOnSale,
      discountPercent: formData.isOnSale ? Number(formData.discount) : 0,
      inStock: formData.inStock,
      type: formData.season,
      variants: colorGroups.map((group) => ({
        color: group.color,
        images: group.images,
        sizes: group.sizes,
      })),
    };
  }, []);

  const queryClient = useQueryClient();

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

    if (!formData.gender) {
      toast.error("Please select gender");
      return;
    }

    if (!formData.group) {
      toast.error("Please select group");
      return;
    }

    setIsLoading(true);

    try {
      const colorGroups = groupImagesByColor(formData.images, colorSizes);
      const apiData = transformFormDataForAPI(formData, colorGroups);

      let response;
      if (id) {
        response = await productAPI.updateProduct(id, apiData);
        console.log(response, "edit");
        queryClient.setQueryData(["products"], (oldData) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((product) =>
              product.id === response.data.id ? response.data : product
            ),
          };
        });
        navigate("/");
        toast.success("Product updated successfully");
      } else {
        response = await productAPI.addProduct(apiData);
        console.log(response, "add");
        queryClient.setQueryData(["products"], (oldData) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: [response.data, ...oldData.data],
          };
        });
        toast.success("Product added successfully!");
      }

      if (!id) {
        setFormData(initialFormData);
        setColorSizes({});
        setPreviewUrls([]);
        setCurrentSizeInput({ color: null, size: "", quantity: 1 });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(
        `Error ${id ? "updating" : "adding"} product: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleEditImage = useCallback((image, imageColor) => {
    setEditingImage({
      originalImage: image,
      color: imageColor,
      editedUrl: image.url,
    });
  }, []);

  const handleReplaceImage = useCallback(() => {
    if (tempFiles.length === 0) {
      toast.error("Please select a new image.");
      return;
    }

    if (!editingImage || !editingImage.originalImage) {
      toast.error("Invalid image selection.");
      return;
    }

    const newFile = tempFiles[0];
    const newUrl = URL.createObjectURL(newFile);
    const originalImage = editingImage.originalImage;
    const originalUrl =
      typeof originalImage === "string" ? originalImage : originalImage.url;

    if (typeof originalUrl === "string" && originalUrl.startsWith("blob:")) {
      URL.revokeObjectURL(originalUrl);
    }

    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.map((img) =>
        img.url === originalUrl
          ? { ...img, file: newFile, url: newUrl, color: editingImage.color }
          : img
      ),
    }));

    setPreviewUrls((prevUrls) =>
      prevUrls.map((url) => (url === originalUrl ? newUrl : url))
    );

    setTempFiles([]);
    setEditingImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [tempFiles, editingImage]);

  const groupedImages = useMemo(
    () =>
      formData.images.reduce((acc, curr) => {
        if (!acc[curr.color]) acc[curr.color] = [];
        acc[curr.color].push(curr);
        return acc;
      }, {}),
    [formData.images]
  );

  if (isFetching) {
    return (
      <div className="max-w-4xl mx-auto p-4 add-product mt-[35px] flex justify-center items-center h-64">
        <Loader type="bubble-spin" bgColor="#000" size={50} />
        <span className="ml-4">Loading product data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 add-product mt-[35px]">
      <h2 className="text-2xl font-bold mb-6">
        {id ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 font-[monospace]">
        <div>
          <label className="block font-medium">Name*</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 border-b border-black bg-transparent focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
                className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
          <label className="block font-medium">
            Collection* <small>(Shirts, Paints, Jackets, etc)</small>
          </label>
          <input
            type="text"
            name="collection"
            required
            placeholder="Enter collection name"
            value={formData.collection}
            onChange={handleInputChange}
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
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
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
          >
            <option value="">Select Group</option>
            <option value="kids">Kids/Boys</option>
            <option value="adults">Adults</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
          </select>
        </div>
        <div className="flex justify-center text-[30px]">
          <span>Select Images For Product</span>
        </div>

        <div>
          <label className="block font-medium">Images</label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="w-full py-4 pl-4 pr-7 bg-transparent border-b border-black focus:outline-none focus:ring-0 focus:border-b-2 focus:border-black transition-colors duration-200"
          />
          {tempFiles.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {tempFiles.length} file(s) selected
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Select Color</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="h-10 w-16 cursor-pointer p-0 border border-gray-300 rounded"
            />
            <div className="flex-1">
              {colorError && (
                <p className="text-red-500 text-sm mt-1">{colorError}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-600">Preview:</span>
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddImages}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
        >
          Add Images
        </button>

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
              onEditImageColor={handleEditImageColor} // NEW PROP
            />
          ))}
        </div>

        {editingImage && (
          <ImageReplacementModal
            editingImage={editingImage}
            tempFiles={tempFiles}
            onFileChange={handleFileUpload}
            onReplace={handleReplaceImage}
            onCancel={() => setEditingImage(null)}
          />
        )}

        {/* NEW: Image Color Edit Modal */}
        {editingImageColor && (
          <ImageColorEditModal
            editingImageColor={editingImageColor}
            onUpdateColor={handleUpdateImageColor}
            onCancel={() => setEditingImageColor(null)}
          />
        )}

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="w-full py-4 bg-[#D9D9D9] rounded-[10px] hover:bg-[#c7c5c5] transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader type="bubble-spin" bgColor="#000" size={30} />
            ) : (
              `${id ? "Update" : "Submit"} Product`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// UPDATED: ColorVariantSection with color edit button
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
  onEditImageColor, // NEW PROP
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

    <div className="mb-4">
      <label className="block font-medium">Sizes for {color}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={currentSizeInput.color === color ? currentSizeInput.size : ""}
          onChange={(e) => onSizeInputChange(e, color, "size")}
          placeholder="Enter size (e.g., S, M, L)"
          className="w-1/3 py-2 pl-4 pr-7 rounded-lg bg-transparent"
        />
        <input
          type="number"
          min="1"
          value={
            currentSizeInput.color === color ? currentSizeInput.quantity : 1
          }
          onChange={(e) => onSizeInputChange(e, color, "quantity")}
          placeholder="Qty"
          className="w-1/4 py-2 pl-4 pr-7 rounded-lg bg-transparent"
        />
        <button
          type="button"
          onClick={() => onAddSize(color)}
          className="w-1/4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Size
        </button>
      </div>

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

    <div className="flex flex-wrap gap-4">
      {images.map((image, index) => (
        <ImageThumbnail
          key={index}
          image={image}
          color={color}
          index={index}
          onEdit={onEditImage}
          onRemove={onRemoveImage}
          onEditColor={onEditImageColor} // NEW PROP
        />
      ))}
    </div>
  </div>
);

// UPDATED: ImageThumbnail with color edit button
const ImageThumbnail = ({
  image,
  color,
  index,
  onEdit,
  onRemove,
  onEditColor,
}) => (
  <div className="relative">
    <img
      src={image.url}
      alt={`${color} ${index + 1}`}
      className="w-24 h-24 object-cover rounded-lg"
      style={{ border: `2px solid ${color}` }}
    />
    <div className="absolute top-0 right-0 flex flex-col">
      <button
        onClick={() => onEdit(image, color)}
        type="button"
        className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600 mb-1"
        title="Replace Image"
      >
        ✎
      </button>
      <button
        onClick={() => onEditColor(image, color, index)}
        type="button"
        className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-green-600 mb-1"
        title="Change Color"
      >
        🎨
      </button>
      <button
        type="button"
        onClick={() => onRemove(index, color)}
        className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
        title="Remove Image"
      >
        ×
      </button>
    </div>
  </div>
);

// NEW: ImageColorEditModal Component
const ImageColorEditModal = ({
  editingImageColor,
  onUpdateColor,
  onCancel,
}) => {
  const [newColor, setNewColor] = useState(editingImageColor.currentColor);

  const handleColorChange = (e) => {
    setNewColor(e.target.value);
  };

  const handleSubmit = () => {
    onUpdateColor(newColor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Change Image Color</h2>

        <div className="mb-4">
          <p className="mb-2">Current Color:</p>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded border border-gray-300"
              style={{ backgroundColor: editingImageColor.currentColor }}
            />
            <span>{editingImageColor.currentColor}</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">New Color:</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={newColor}
              onChange={handleColorChange}
              className="h-10 w-16 cursor-pointer p-0 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={newColor}
              onChange={handleColorChange}
              placeholder="#000000"
              className="flex-1 py-2 px-3 border border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-600">Preview:</span>
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: newColor }}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Update Color
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

// ... (rest of your components: SizeChip, ImageReplacementModal remain the same) ...

const SizeChip = ({
  sizeObj,
  color,
  editingSizeInfo,
  onEdit,
  onUpdate,
  onCancel,
  onRemove,
}) => {
  const isEditing =
    editingSizeInfo?.color === color && editingSizeInfo?.sizeId === sizeObj.id;

  return (
    <div className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded">
      {isEditing ? (
        <div className="flex items-center">
          <input
            type="text"
            value={editingSizeInfo.currentValue}
            onChange={(e) =>
              onEdit(color, { ...sizeObj, value: e.target.value })
            }
            className="text-black px-1 mr-1 rounded"
          />
          <input
            type="number"
            min="1"
            value={editingSizeInfo.currentQuantity}
            onChange={(e) =>
              onEdit(color, {
                ...sizeObj,
                quantity: parseInt(e.target.value) || 0,
              })
            }
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

const ImageReplacementModal = ({
  editingImage,
  tempFiles,
  onFileChange,
  onReplace,
  onCancel,
}) => {
  const selectedReplacementImage =
    tempFiles.length > 0 ? URL.createObjectURL(tempFiles[0]) : null;

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
              className={`max-w-full h-48 object-cover rounded ${
                !selectedReplacementImage
                  ? "border-2 border-dashed border-gray-300"
                  : ""
              }`}
            />
            {!selectedReplacementImage && (
              <p className="text-center text-gray-500 mt-2">
                No image selected
              </p>
            )}
          </div>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="w-full py-2 pl-4 pr-7 rounded-lg bg-transparent mb-4"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={onReplace}
            disabled={tempFiles.length === 0}
            className={`py-2 px-4 rounded ${
              tempFiles.length > 0
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

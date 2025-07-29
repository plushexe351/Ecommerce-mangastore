import React, { useState, useContext, useEffect } from "react";
import { Image, Plus, Trash2, Edit } from "react-feather";
import { Context } from "../../context/ContextProvider";
import {
  storage,
  db,
  ref,
  uploadBytes,
  getDownloadURL,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "../../db/firebase";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { p } from "framer-motion/client";

const ManageBooks = () => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const emptyForm = {
    name: "",
    category: "",
    fakeMRP: "",
    discount: "",
    MRP: "",
    images: [],
    sizes: "",
    tags: "",
    stock: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const { admin, fetchProducts, products } = useContext(Context);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditMode(false);
    setFormData(emptyForm);
    setImageFiles([]);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImages = formData.images;
    if (imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map(async (file) => {
          const imageRef = ref(storage, `products/${file.name}`);
          await uploadBytes(imageRef, file);
          return await getDownloadURL(imageRef);
        })
      );
    }

    const productData = { ...formData, images: uploadedImages };

    if (editMode) {
      await updateDoc(doc(db, "products", editProductId), productData);
    } else {
      await addDoc(collection(db, "products"), productData);
    }

    setShowForm(false);
    setFormData(emptyForm);
    setImageFiles([]);
    setEditMode(false);
    setEditProductId(null);
    fetchProducts();
    setLoading(false);
  };

  const handleEdit = (product) => {
    setFormData({ ...product });
    setShowForm(true);
    setEditMode(true);
    setEditProductId(product.id);
  };

  const handleDelete = async (productId) => {
    await deleteDoc(doc(db, "products", productId));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <main>
      <header id="heading">
        <div className="title">
          📚 Manage Books ({products.length ? products.length : "loading"})
        </div>
      </header>
      <div className="btn--add-product" onClick={toggleForm}>
        <Plus /> {editMode ? "Edit Product" : "List a Product"}
      </div>

      {showForm && (
        <div className="form-modal">
          <form className="product-form" onSubmit={handleSubmit}>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Action">Action</option>
              <option value="Scifi">Scifi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Shonen">Shonen</option>
              <option value="Seinen">Seinen</option>
              <option value="Horror">Horror</option>
              <option value="Sports">Sports</option>
            </select>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="fakeMRP"
              placeholder="Fake MRP (INR)"
              value={formData.fakeMRP}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="MRP"
              placeholder="MRP (INR)"
              value={formData.MRP}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="discount"
              placeholder="Discount in % (leave empty if inapplicable)"
              value={formData.discount}
              onChange={handleInputChange}
            />

            <input
              type="text"
              name="tags"
              placeholder="Tags (comma separated)"
              value={formData.tags}
              onChange={handleInputChange}
              required
            />

            <input
              type="text"
              name="sizes"
              placeholder="Sizes (comma separated)"
              value={formData.sizes}
              onChange={(e) =>
                setFormData({ ...formData, sizes: e.target.value })
              }
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Items in Stock"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
            />

            <label htmlFor="image-upload" id="upload-label">
              <Image className="upload-icon" />
              {imageFiles.length || formData.images.length
                ? `${
                    imageFiles.length || formData.images.length
                  } Images Uploaded`
                : "Upload Images"}
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              id="image-upload"
            />
            <div className="actions">
              <button type="submit">{loading ? "Loading..." : "Submit"}</button>
              <button onClick={toggleForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {products.map((product) => (
        <div className="product-view" key={product.id}>
          <div className="select-view-img">
            {product?.images.map((img, idx) => (
              <LazyLoadImage
                src={img}
                alt={`Product ${idx}`}
                key={idx}
                effect="blur"
              />
            ))}
          </div>
          <div className="view-image">
            <img src={product.images[0]} alt="Product" />
          </div>
          <div className="product-details-and-actions">
            <div className="title">{product.name}</div>
            <div className="category">{product.category} comic</div>
            <p className="price">
              MRP : ₹ <span className="fakeMRP">{product.fakeMRP}</span>
              {product.MRP}
            </p>
            <div className="discount">
              Discount :
              {product.discount ? <span>{product.discount}%</span> : " 0"}
            </div>
            <p className="discounted-price">
              Discounted MRP : ₹
              {product.MRP - (product.discount / 100) * product.MRP ||
                product.MRP}
            </p>
            <p className="stock">Items in Stock : {product.stock}</p>
            {product.stock < 10 && (
              <p className="stock-unavailability-alert">
                {product.stock === 0
                  ? "Sold Out"
                  : `Only ${product.stock} items remaining in stock`}
              </p>
            )}
            <div className="actions">
              <div className="edit" onClick={() => handleEdit(product)}>
                <Edit stroke="gray" size={20} /> Edit
              </div>
              <div className="delete" onClick={() => handleDelete(product.id)}>
                <Trash2 stroke="gray" size={20} /> Delete
              </div>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default ManageBooks;

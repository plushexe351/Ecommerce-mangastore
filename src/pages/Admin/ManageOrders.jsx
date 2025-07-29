import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../db/firebase";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Circle } from "react-feather";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";

const ManageOrders = () => {
  const [orders, setOrders] = useState(null);
  const [editingOrderIndex, setEditingOrderIndex] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const usersCollection = collection(db, "users");
        const querySnapshot = await getDocs(usersCollection);
        const allOrders = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.orders && userData.orders.length > 0) {
            allOrders.push(
              ...userData.orders.map((order) => ({
                ...order,
                userId: doc.id, // optionally include userId
              }))
            );
          }
        });

        setOrders(allOrders);
        console.log(allOrders);
      } catch (error) {
        console.error("Error fetching all users' orders: ", error);
      }
    };

    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderIndex, newStatus) => {
    try {
      const updatedOrders = [...orders];
      updatedOrders[orderIndex].status = newStatus;
      setOrders(updatedOrders);

      const userId = updatedOrders[orderIndex].userId;
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedUserOrders = userData.orders.map((order, index) =>
          index === orderIndex ? { ...order, status: newStatus } : order
        );

        await updateDoc(userDocRef, { orders: updatedUserOrders });
        setEditingOrderIndex(null);
      }
    } catch (error) {
      console.error("Error updating order status: ", error);
    }
  };

  return (
    <div className="ManageOrders Orders">
      <main>
        <header id="heading">
          <div className="title">🛒 Manage Orders ({orders?.length})</div>
        </header>
        {!orders?.length && <p>It's empty in here</p>}
        <main>
          {orders?.map((order, index) => (
            <React.Fragment key={index}>
              <div className="order-details">
                <p className="title">Order {index + 1}</p>
                <p>
                  {new Date(order.orderDate)
                    .toLocaleDateString()
                    .replaceAll("/", "-")}
                </p>
                <p>{order.items.length} Items</p>
                <p>Order value : ₹{order.totalAmount}</p>
              </div>
              {order.items.map((product, productIndex) => (
                <div className="product-view" key={productIndex}>
                  <div className="select-view-img">
                    {product.images?.map((img, imgIndex) => (
                      <LazyLoadImage
                        src={img}
                        alt={`Product ${imgIndex}`}
                        key={imgIndex}
                        className="select-view-image"
                        effect="blur"
                      />
                    ))}
                  </div>
                  <div className="view-image">
                    <LazyLoadImage
                      src={
                        product.images
                          ? product.images[product.images.length - 1]
                          : ""
                      }
                      className="view-image"
                      alt="Product"
                      effect="blur"
                    />
                  </div>
                  <div className="product-details-and-actions">
                    <header>
                      <div
                        className="order-status"
                        onClick={() =>
                          setEditingOrderIndex(
                            editingOrderIndex === index ? null : index
                          )
                        }
                      >
                        <Circle
                          className={`icon ${
                            order.status === "Order Cancelled"
                              ? "cancelled"
                              : ""
                          }`}
                        />
                        Order Status : {order.status}
                        <ChevronsUpDown className="icon" />
                        {editingOrderIndex === index && (
                          <div className="status-menu">
                            {[
                              "Order Confirmed",
                              "Order Shipped",
                              "Out for delivery",
                              "Delivered",
                              "Cancelled",
                            ].map((status) => (
                              <div
                                key={status}
                                className="status-option"
                                onClick={() =>
                                  handleStatusChange(index, status)
                                }
                              >
                                {status}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="title">{product?.name}</div>
                      <div className="category">
                        <span>{product?.category} comic</span>
                      </div>

                      <div className="ordered-by-details">
                        {order?.displayName && (
                          <div className="title">
                            Username : {order?.displayName}
                          </div>
                        )}

                        <div className="title">
                          User Id : <span>{order?.userId}</span>
                        </div>
                        <div className="title">
                          Product Id : <span>{product?.productId}</span>
                        </div>
                        <div className="title">
                          Shipping To :{" "}
                          <span>
                            {order?.shippingAddress} {order?.pincode}
                          </span>
                        </div>
                        <div className="title">
                          Contact : <span>{order?.contactNumber}</span>
                        </div>
                      </div>
                    </header>
                    <div className="select-size">
                      <div className="sizes">
                        <div className="size">
                          <span>UK {product.size}</span>
                        </div>
                      </div>
                      <div className="quantity">
                        Quantity:
                        <select value={product.quantity} disabled>
                          {[...Array(10).keys()].map((num) => (
                            <option key={num + 1} value={num + 1}>
                              {num + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="pricing">
                      <p className="price">
                        MRP: ₹ {product?.discountedPrice || product?.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </main>
      </main>
    </div>
  );
};

export default ManageOrders;

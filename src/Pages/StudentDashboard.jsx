import { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    axios
      .get("/api/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setOrders(res.data));
    // Fetch progress from products
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center">Student Dashboard</h1>
      <section>
        <h2>Purchases</h2>
        {orders.map((order) => (
          <div key={order._id}>
            <p>
              {order.productId.title} - £{order.amount}
            </p>
            <a href={order.receiptUrl}>Download Receipt</a>
          </div>
        ))}
      </section>
      <section>
        <h2>Progress</h2>
        {/* Progress bars */}
      </section>
    </div>
  );
};

export default StudentDashboard;

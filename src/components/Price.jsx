import React from "react";

const Price = ({ product }) => {
  return (
    <>
      {" "}
      MRP : ₹
      {product.fakeMRP && (
        <>
          <span className="fakeMRP">{parseFloat(product.fakeMRP)}</span>
          {product.discount <= 0 && (
            <span className="MRP">{parseFloat(product.MRP)}</span>
          )}
          {product.discount > 0 && (
            <>
              <span className="fakeMRP">{parseFloat(product.MRP)}</span>
              <span className="MRP">
                {parseFloat(
                  product.MRP - (product.discount / 100) * product.MRP
                )}
              </span>
            </>
          )}
        </>
      )}
      {!product.fakeMRP && product.discount >= 1 && (
        <>
          <span className="fakeMRP">{parseFloat(product.MRP)}</span>
          <span className="MRP">
            {parseFloat(
              product.MRP - (product.discount / 100) * product.MRP ||
                product.MRP
            )}
          </span>
        </>
      )}
      {!product.fakeMRP && !product.discount >= 1 && (
        <>
          <p className="MRP">{product.MRP}</p>
        </>
      )}
    </>
  );
};

export default Price;

import PropTypes from 'prop-types';

function ProductHeader({ productName, productImage, productPrice }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center space-x-4">
        {productImage && (
          <img 
            src={productImage} 
            alt={productName}
            className="w-20 h-20 object-cover rounded"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{productName}</h1>
          {productPrice && (
            <p className="text-xl text-green-600 font-semibold">${productPrice}</p>
          )}
        </div>
      </div>
    </div>
  );
}

ProductHeader.propTypes = {
  productName: PropTypes.string.isRequired,
  productImage: PropTypes.string,
  productPrice: PropTypes.number,
};

export default ProductHeader;


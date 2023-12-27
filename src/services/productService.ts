import {db} from '../config/database'

class ProductService {
  getAllProducts() {
    return db.product.findMany();
  }

  getProductById(productId: number) {
    return db.product.findUnique({ where: { id: productId } });
  }

  createProduct(name: string, description: string, price: number) {
    return db.product.create({
      data: {
        name,
        description,
        price,
      },
    });
  }

  updateProduct(productId: number, name: string, description: string, price: number) {
    return db.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
      },
    });
  }

  deleteProduct(productId: number) {
    return db.product.delete({ where: { id: productId } });
  }
}

export default new ProductService();

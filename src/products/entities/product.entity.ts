export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number; // campo interno
  createdAt: Date;

  constructor(
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.createdAt = new Date();
  }
}

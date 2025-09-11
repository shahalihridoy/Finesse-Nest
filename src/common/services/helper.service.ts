import { Injectable } from '@nestjs/common';

export interface FormattedProduct {
  id: number;
  order_no?: string;
  slug?: string;
  productName: string;
  productImage?: string;
  model?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  sellingPrice: number;
  brief_description?: string;
  discountedPrice: number;
  discount: number;
  isNew: boolean;
  isFeatured: boolean;
  stock: number;
  isWishlist: boolean;
  rating: number;
  reviews: number;
  allImages?: any[];
}

export interface MainProductWithStock {
  id: number;
  productName: string;
  sellingPrice: number;
  discount: number;
  isWishlist?: boolean;
  discountedPrice: number;
  stock: number;
  variationstock?: any[];
}

export interface VariationProductWithStock {
  id: number;
  productName: string;
  sellingPrice: number;
  stock: number;
  purchasestock?: any;
  sellstock?: any;
}

@Injectable()
export class HelperService {
  /**
   * Format product data - maintains exact same logic as original HelperClass.formatProduct
   */
  async formatProduct(product: any): Promise<FormattedProduct> {
    const formattedProduct: FormattedProduct = {
      id: product.id,
      order_no: product.order_no,
      slug: product.slug,
      productName: product.productName,
      productImage: product.productImage,
      model: product.model,
      brand: product.allbrand ? product.allbrand.name : 'Brand',
      category: product.allgroup ? product.allgroup.groupName : 'Category',
      subcategory: product.allcategory ? product.allcategory.catName : 'Subcategory',
      sellingPrice: product.sellingPrice,
      brief_description: product.brief_description,
      discountedPrice: product.sellingPrice,
      discount: product.discount,
      isNew: product.isNew,
      isFeatured: product.isFeatured,
      stock: product.stock,
      isWishlist: product.isWishlist ? true : false,
      rating: product.avgRating ? product.avgRating.averageRating : 0,
      reviews: product.__meta__?.allreviews_count ? product.__meta__.allreviews_count : 0,
      allImages: product.allImages
    };

    // Apply discount calculation - exact same logic as original
    if (formattedProduct.discount > 0) {
      formattedProduct.discountedPrice = formattedProduct.sellingPrice - Math.ceil((formattedProduct.discount * formattedProduct.sellingPrice) / 100);
    }

    return formattedProduct;
  }

  /**
   * Format main product stock - maintains exact same logic as original HelperClass.formatMainProductStock
   */
  async formatMainProductStock(product: any): Promise<MainProductWithStock> {
    let stock = 0;
    
    // Calculate stock from variation products - exact same logic as original
    for (const p of product.variationstock) {
      let vstock = 0;
      if (p.purchasestock) vstock = p.purchasestock.stock;
      if (p.sellstock) vstock = vstock - p.sellstock.stock;
      stock = stock + vstock;
    }

    product.stock = stock;
    delete product.variationstock;

    product.discountedPrice = product.sellingPrice;

    // Apply discount calculation - exact same logic as original
    if (product.discount > 0) {
      const price = parseInt(product.sellingPrice);
      product.discountedPrice = price - ((parseInt(product.discount) * price) / 100);
    }

    return product;
  }

  /**
   * Format variation product stock - maintains exact same logic as original HelperClass.formatVariationProductStock
   */
  async formatVariationProductStock(product: any): Promise<VariationProductWithStock> {
    let stock = 0;
    if (product.purchasestock) stock = product.purchasestock.stock;
    if (product.sellstock) stock = stock - product.sellstock.stock;

    product.stock = stock;
    delete product.purchasestock;
    delete product.sellstock;

    return product;
  }

  /**
   * Generate unique ID - maintains same functionality as uniqid
   */
  generateUniqueId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Generate random token - maintains same functionality as random-token
   */
  generateRandomToken(length: number = 4): string {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate phone number - maintains exact same regex validation as original
   */
  validatePhoneNumber(contact: string): boolean {
    const regex = /^[0][1][3-9][0-9]{8}$/;
    return regex.test(contact);
  }

  /**
   * Format date with timezone - maintains same functionality as moment-timezone
   */
  formatDateWithTimezone(date: Date, timezone: string = 'Asia/Dhaka'): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date).replace(',', '');
  }
}
